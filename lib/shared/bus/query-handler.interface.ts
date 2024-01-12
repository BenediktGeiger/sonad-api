import { Query } from './query.interface';

export type QueryHandlerResponse = {
	success: boolean;
	payload: any;
};

export interface QueryHandler<TQuery extends Query> {
	execute(command: TQuery): Promise<QueryHandlerResponse>;
}
