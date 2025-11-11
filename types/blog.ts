export interface BlogPost {
	id: string;
	number: number;
	title: string;
	excerpt?: string;
	excerptHTML?: string;
	createdAt: string;
	updatedAt: string;
	commentCount: number;
	category: {
		name: string;
		emoji: string;
		slug: string;
	};
	labels: Array<{
		id: string;
		name: string;
		color: string;
	}>;
}

export interface BlogPostDetails extends BlogPost {
	body: string;
	bodyHTML: string;
	url: string;
	author: {
		login: string;
		avatarUrl: string;
	};
}

export interface BlogComment {
	id: string;
	body: string;
	bodyHTML: string;
	createdAt: string;
	author: {
		login: string;
		avatarUrl: string;
	};
	replies?: BlogCommentReply[];
}

export interface BlogCommentReply {
	id: string;
	body: string;
	bodyHTML: string;
	createdAt: string;
	author: {
		login: string;
		avatarUrl: string;
	};
}
