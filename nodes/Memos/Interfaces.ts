import { AllEntities, PropertiesOf } from 'n8n-workflow';

export type MemosMap = {
	user: 'listUsers' | 'getUser';
	memo: 'listMemos' | 'getMemo';
};

export type MemosAction = AllEntities<MemosMap>;
export type MemosProperties = PropertiesOf<MemosAction>;
