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
						name: 'List Memos',
						value: 'listMemos',
						action: 'List memos',
					},
					{
						name: 'Get Memo',
						value: 'getMemo',
						action: 'Get memo',
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
						operation: ['getUser', 'getMemo'],
					},
				},
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
					data = await apiRequest.call(this, 'GET', 'memos');
					break;
				case 'getUser':
				case 'getMemo':
					const name = this.getNodeParameter('name', index) as string;
					data = await apiRequest.call(this, 'GET', name);
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
