/* eslint-disable n8n-nodes-base/node-class-description-icon-not-svg */
/* eslint-disable n8n-nodes-base/node-class-description-icon-not-svg */
import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { MemosAction } from './Interfaces';
import { apiRequest } from './GenericFunctions';

export class Memos implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Memos',
		name: 'memos',
		icon: 'file:memos.png',
		description: 'Consume Memos API',
		subtitle: '={{ $parameter["operation"] }}',
		version: 1,
		defaults: {
			name: 'Memos',
		},
		group: ['transform'],
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'memosApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'memos',
				options: [
					{
						name: 'User',
						value: 'users',
					},
					{
						name: 'Memo',
						value: 'memos',
					},
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'listUsers',
				options: [
					{
						name: 'List Users',
						value: 'listUsers',
						action: 'List users',
					},
					{
						name: 'Get User',
						value: 'getUser',
						action: 'Get user',
					},
				],
				displayOptions: {
					show: {
						resource: ['users'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'listMemos',
				options: [
					{
						name: 'Create Memo',
						value: 'createMemo',
						action: 'Create memo',
					},
					{
						name: 'Delete Memo',
						value: 'deleteMemo',
						action: 'Delete memo',
					},
					{
						name: 'Get Memo',
						value: 'getMemo',
						action: 'Get memo',
					},
					{
						name: 'List Memos',
						value: 'listMemos',
						action: 'List memos',
					},
					{
						name: 'Update Memo',
						value: 'updateMemo',
						action: 'Update memo',
					},
				],
				displayOptions: {
					show: {
						resource: ['memos'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				hint: 'users/1 or memos/1',
				displayOptions: {
					show: {
						operation: ['getUser', 'getMemo', 'updateMemo', 'deleteMemo'],
					},
				},
			},
			// Create Memo fields
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				description: 'The content of the memo',
				displayOptions: {
					show: {
						operation: ['createMemo'],
					},
				},
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: [
					{
						name: 'Private',
						value: 'PRIVATE',
					},
					{
						name: 'Workspace',
						value: 'WORKSPACE',
					},
					{
						name: 'Public',
						value: 'PUBLIC',
					},
				],
				default: 'PRIVATE',
				description: 'Visibility of the memo',
				displayOptions: {
					show: {
						operation: ['createMemo'],
					},
				},
			},
			// Update Memo fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['updateMemo'],
					},
				},
				options: [
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'The content of the memo',
					},
					{
						displayName: 'Visibility',
						name: 'visibility',
						type: 'options',
						options: [
							{
								name: 'Private',
								value: 'PRIVATE',
							},
							{
								name: 'Workspace',
								value: 'WORKSPACE',
							},
							{
								name: 'Public',
								value: 'PUBLIC',
							},
						],
						default: 'PRIVATE',
						description: 'Visibility of the memo',
					},
					{
						displayName: 'Pinned',
						name: 'pinned',
						type: 'boolean',
						default: false,
						description: 'Whether the memo is pinned',
					},
					{
						displayName: 'Row Status',
						name: 'rowStatus',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'ACTIVE',
							},
							{
								name: 'Archived',
								value: 'ARCHIVED',
							},
						],
						default: 'ACTIVE',
						description: 'Status of the memo',
					},
				],
			},
			// List Memos filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						operation: ['listMemos'],
					},
				},
				options: [
					{
						displayName: 'Tag',
						name: 'tag',
						type: 'string',
						default: '',
						description: 'Filter by tag (without # symbol)',
					},
					{
						displayName: 'Row Status',
						name: 'rowStatus',
						type: 'options',
						options: [
							{
								name: 'Normal',
								value: 'NORMAL',
							},
							{
								name: 'Archived',
								value: 'ARCHIVED',
							},
						],
						default: 'NORMAL',
						description: 'Filter by memo status',
					},
					{
						displayName: 'Content Search',
						name: 'content',
						type: 'string',
						default: '',
						description: 'Search for keywords in memo content',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource');

		const result: INodeExecutionData[] = [];
		for (let index = 0; index < items.length; index++) {
			const operation = this.getNodeParameter('operation', index);
			const action = { resource, operation } as MemosAction;

			let data: IDataObject;
			switch (action.operation) {
				case 'listUsers':
					data = await apiRequest.call(this, 'GET', 'users');
					break;

				case 'listMemos':
					const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
					// Build query parameters from filters
					const queryParams: IDataObject = {};
					if (filters.tag) queryParams.tag = filters.tag;
					if (filters.rowStatus) queryParams.rowStatus = filters.rowStatus;
					if (filters.content) queryParams.content = filters.content;
					data = await apiRequest.call(this, 'GET', 'memos', undefined, queryParams);
					break;

				case 'getUser':
				case 'getMemo':
					const name = this.getNodeParameter('name', index) as string;
					data = await apiRequest.call(this, 'GET', name);
					break;

				case 'createMemo':
					const content = this.getNodeParameter('content', index) as string;
					const visibility = this.getNodeParameter('visibility', index) as string;
					const createBody = {
						content,
						visibility,
					};
					data = await apiRequest.call(this, 'POST', 'memo', createBody);
					break;

				case 'updateMemo':
					const memoName = this.getNodeParameter('name', index) as string;
					const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;
					data = await apiRequest.call(this, 'PATCH', memoName, updateFields);
					break;

				case 'deleteMemo':
					const deleteName = this.getNodeParameter('name', index) as string;
					// Extract memo ID from name format "memos/123"
					const memoId = deleteName.split('/')[1];
					data = await apiRequest.call(this, 'DELETE', `memo/${memoId}`);
					break;
			}

			const json = this.helpers.returnJsonArray(data);
			const executionData = this.helpers.constructExecutionMetaData(json, {
				itemData: { item: index },
			});
			result.push(...executionData);
		}
		return [result];
	}
}