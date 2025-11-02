export interface Discussion {
	id: number;
	number: number;
	title: string;
	html_url: string;
	created_at: string;
	comments: number;
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
