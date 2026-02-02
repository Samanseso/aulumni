import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import alumni from '../routes/alumni/index';
import Contact from '../pages/admin/create-alumni/contact';

export interface Auth {
	user: User;
}

export interface BreadcrumbItem {
	title: string;
	href: string;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

export interface NavItem {
	title: string;
	href: NonNullable<InertiaLinkProps['href']>;
	icon?: LucideIcon | null;
	isActive?: boolean;
	subNavItem?: NavItem[];
}

export interface SharedData {
	name: string;
	auth: Auth;
	sidebarOpen: boolean;
	[key: string]: unknown;
}


export interface Admin {
	id: number;
	username: string;
	password: string;
	firstname: string;
	middlename: string;
	lastname: string;
	photo: string;
	created_on: string;
	author: string;
};

export interface AlumniPersonalDetails {
	first_name: string;
	middle_name: string;
	last_name: string;
	photo?: string | null;
	gender: string | null;
	birthday: string | null;
	bio?: string | null;
	interest?: string | null;
	address?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}


export interface AlumniAcademicDetails {
	student_number: string;
	school_level: string;
	batch: string;
	campus: string;
	course: string;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface AlumniContactDetails {
	email: string;
	contact: string;
	mailing_address?: string | null;
	present_address?: string | null;
	provincial_address?: string | null;
	facebook_url?: string | null;
	twitter_url?: string | null;
	gmail_url?: string | null;
	link_url?: string | null;
	other_url?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface AlumniEmploymentDetails {
	first_work_position?: string | null;
	first_work_time_taken?: string | null;
	first_work_acquisition?: string | null;
	current_employed?: string | null;
	current_work_type?: string | null;
	current_work_status?: string | null;
	current_work_company?: string | null;
	current_work_position?: string | null;
	current_work_years?: string | null;
	current_work_monthly_income?: string | null;
	current_work_satisfaction?: string | null;
	au_skills?: string | null;
	au_usefulness?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

interface User {
	user_id: int;
	name: string;
	user_name: string;
	email: string;
	user_type: string;
	password: string;
	status: string;
	created_by: string;
	created_at: string;
	updated_at: string;
}

export interface Employee extends User {
	employee_id: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	contact: string;
	branch: string;
	department: string;
}


export interface Alumni extends User {
	alumni_id: string;
	personal_details?: AlumniPersonalDetails | null;
	academic_details?: AlumniAcademicDetails | null;
	contact_details?: AlumniContactDetails | null;
	employment_details?: AlumniEmploymentDetails | null;
}




export interface PaginationLink {
	url: string;
	label: string;
	active: boolean;
}

export interface Pagination<T> {
	current_page: number;
	data: T;
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: PaginationLink[];
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number;
	total: number;
}

export interface AlumniRow {
	alumni_id: string;
	user_id: number;
	user_name: string;
	status: string;
	first_name: string;
	last_name: string;
	email: string;
	student_number: string;
	school_level: string;
	course: string;
	campus: string;
	batch: string;
	created_at: string;
}

export interface ModalType {
	status: string;
	action: string;
	title: string;
	message: string;
}

export interface Branch {
	branch_id: number
	name: string;
	address: string;
	contact: string;
	created_at?: string;
	updated_at?: string;
}

export interface Department {
	department_id: number
	name: string;
	description?: string | null;
	created_at?: string;
	updated_at?: string;
}

export interface Course {
	course_id: number
	department_id: number
	name: string;
	code: string;
	created_at?: string;
	updated_at?: string;
	department?: Department
}


export interface Batch {
	year: string;
	name: string;
	created_at: string;
	updated_at: string;
}

export interface Filter {
	property: string;
	value: string;
}


export interface ActionModalContentType {
	url: RouteDefinition<"delete"> | RouteDefinition<"patch"> | RouteDefinition<"post">;
	message: string;
	action: string;
	data?: any;
	promptPassword?: boolean;
}


interface ColumnType {
	name: string;
	db_name: string;
}



export interface Post {
	post_id: number;
	post_uuid: string;
	user_id: number;
	content: string;
	place: string | null;
	privacy: 'public' | 'friends' | 'only_me';
	comments_count: number;
	reactions_count: number;
	status: string;
	created_at: string;
	updated_at: string;
}

export type PostRow = { post_id: ID;
	post_uuid: string;
	user_id: number;
	user: User;
	content: string;
	attachments?: Attachment[];
	privacy: 'public' | 'friends' | 'only_me';
	comments_count: number;
	reactions_count: number;
	status: string;
	created_at: string;
	updated_at: string;
};



export interface Attachment {
	attachment_id: number;
	post_id: number;
	url: string;
	type: 'image' | 'video' | 'file';
	created_at: string;
	updated_at: string;
}

export interface Comment {
	comment_id: number;
	post_id: number;
	user_id: number;
	content: string;
	created_at: string;
	updated_at: string;
}

export interface Reaction {
	reaction_id: number;
	post_id: number;
	user_id: number;
	type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
	created_at: string;
}

export interface Share {
	share_id: number;
	post_id: number;
	user_id: number;
	comment: string | null;
	created_at: string;
}

export interface CreatePostDTO {
	user_id: number;
	content: string;
	place?: string | null;
	privacy?: 'public' | 'friends' | 'only_me';
}

export interface CreateAttachmentDTO {
	post_id: number;
	url: string;
	type?: 'image' | 'video' | 'file';
}

export interface CreateCommentDTO {
	post_id: number;
	user_id: number;
	content: string;
}

export interface CreateReactionDTO {
	post_id: number;
	user_id: number;
	type?: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
}

export interface CreateShareDTO {
	post_id: number;
	user_id: number;
	comment?: string | null;
}
