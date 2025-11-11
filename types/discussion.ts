export interface Discussion {
	id: number;
	number: number;
	title: string;
	html_url: string;
	created_at: string;
	updated_at?: string;
	comments: number;
	body?: string;
	node_id?: string;
	user?: {
		login: string;
		avatar_url: string;
	};
	category: {
		name: string;
		emoji: string;
		slug: string;
	};
	labels: Array<{
		id: number;
		name: string;
		color: string;
	}>;
}
