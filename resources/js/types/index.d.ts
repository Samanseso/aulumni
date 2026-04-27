import survey from '../routes/survey/index';


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
	signals?: OperationSignals;
	[key: string]: unknown;
}


export interface Admin extends User {

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
	branch_id?: number | null;
	department_id?: number | null;
	course_id?: number | null;
	branch?: string | null;
	course?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface AlumniContactDetails {
	email: string;
	contact: string;
	telephone?: string | null;
	mailing_address?: string | null;
	present_address?: string | null;
	provincial_address?: string | null;
	company_address?: string | null;
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

export interface User {
	user_id: number;
	name: string;
	user_name: string;
	email: string;
	email_verified_at?: string | null;
	avatar?: string | null;
	survey_completed: boolean;
	user_type: string;
	password: string;
	status: string;
	created_by?: string | null;
	created_at: string;
	updated_at: string;
}

export interface Employee extends User {
	employee_id: string;
	branch_id?: number | null;
	department_id?: number | null;
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
	branch: string;
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
	departments?: Department[];
	departments_count?: number;
	courses_count?: number;
	employees_count?: number;
	alumni_count?: number;
	created_at?: string;
	updated_at?: string;
}

export interface Department {
	department_id: number
	branch_id: number
	name: string;
	description?: string | null;
	branch?: Branch;
	courses?: Course[];
	courses_count?: number;
	employees_count?: number;
	alumni_count?: number;
	created_at?: string;
	updated_at?: string;
}

export interface Course {
	course_id: number
	branch_id: number
	department_id: number
	name: string;
	code: string;
	created_at?: string;
	updated_at?: string;
	branch?: Branch
	department?: Department
}


export interface Batch {
	year: string;
	name: string;
	alumni_count?: number;
	created_at?: string;
	updated_at?: string;
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
	job_title: string;
	company: string;
	location: string;
	job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
	salary?: string | null;
	job_description: string;
	privacy: 'public' | 'friends' | 'only_me';
	comments_count: number;
	reactions_count: number;
	status: string;
	created_at: string;
	updated_at: string;
}


export interface CompletePost extends Post {
	attachments: Attachment[];
	comments: Comment[];
	liked_by_user: boolean;
	author: User;
};



export type PostRow = {
	post_id: number;
	post_uuid: string;
	user_id: number;
	author: { user_id: number; name?: string; user_name?: string; email?: string };
	job_title: string;
	attachments?: Attachment[];
	privacy: 'public' | 'friends' | 'only_me';
	comments_count: number;
	reactions_count: number;
	status: string;
	created_at: string;
	updated_at: string;
};

export type GroupedPost = {
	[key: string]: PostRow[];
}

export interface Announcement {
	announcement_id: number;
	announcement_uuid: string;
	user_id: number;
	title: string;
	event_type: 'Seminar' | 'Workshop' | 'Webinar' | 'Career Fair' | 'Alumni Gathering' | 'General Event';
	organizer?: string | null;
	venue: string;
	starts_at: string;
	ends_at?: string | null;
	description: string;
	privacy: 'public' | 'friends' | 'only_me';
	status: string;
	created_at: string;
	updated_at: string;
}

export interface CompleteAnnouncement extends Announcement {
	attachments: AnnouncementAttachment[];
	author: { user_id: number; name?: string; user_name?: string; email?: string };
}

export type AnnouncementRow = {
	announcement_id: number;
	announcement_uuid: string;
	user_id: number;
	title: string;
	event_type: Announcement['event_type'];
	venue: string;
	starts_at: string;
	status: string;
	created_at: string;
	updated_at: string;
	author: { user_id: number; name?: string; user_name?: string; email?: string };
	attachments?: AnnouncementAttachment[];
};

export type GroupedAnnouncement = {
	[key: string]: AnnouncementRow[];
}


export interface Attachment {
	attachment_id: number;
	post_id: number;
	url: string;
	type: 'image' | 'video' | 'file';
	created_at: string;
	updated_at: string;
}

export interface AnnouncementAttachment {
	announcement_attachment_id: number;
	announcement_id: number;
	url: string;
	type: 'image' | 'video' | 'file';
	created_at: string;
	updated_at: string;
}

export interface Comment {
	comment_id: number;
	post_id: number;
	user_id: number;
	parent_comment_id: number | null;
	author: User;
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

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo;
    }
}


export interface ImportFailureItem {
  row: number | null;
  attribute: string | null;
  errors: string[];
  values: Record<string, any> | any[] | null;
}

export interface ImportFailureRow {
  row: number | string | null;
  errors: string[];
  attributes: (string | null)[];
  values: (Record<string, any> | any[] | null)[];
}

export interface ImportReport {
  total: number | null;
  succeeded: number | null;
  failed: number;
  failures: ImportFailureRow[];
  report_url?: string | null;
}





export interface ImportReportNotificationPayload {
  title: string;
  message: string;
  report: ImportReport;
  timestamp: string;
}

export interface PostLikedNotificationPayload {
  title: string;
  message: string;
  actor_name: string;
  actor_user_name?: string | null;
  post_id: number;
  job_title: string;
  timestamp: string;
  action_url?: string | null;
}

export interface EmploymentSurveySubmittedNotificationPayload {
  title: string;
  message: string;
  alumni_name: string;
  alumni_user_name?: string | null;
  email?: string | null;
  account_status?: string | null;
  school_level?: string | null;
  current_employed?: string | null;
  current_work_company?: string | null;
  timestamp: string;
  action_url?: string | null;
}

export interface ReportSummaryMetric {
    label: string;
    value: number | string;
    helper: string;
}

export interface ReportDatasetColumn {
    key: string;
    label: string;
}

export interface ReportDatasetRow {
    [key: string]: string | number | null;
}

export interface ReportDataset {
    title: string;
    description: string;
    columns: ReportDatasetColumn[];
    rows: ReportDatasetRow[];
}

export interface ReportDatasetGroup {
    title: string;
    description: string;
    datasets: ReportDataset[];
}

export interface OperationSignals {
    deselect?: string | null;
}

export interface DashboardOverviewCard {
    id: string;
    label: string;
    value: number | string;
    helper: string;
    trend_label: string;
    trend_value: string;
    sparkline: Array<{
        label: string;
        value: number;
    }>;
}

export interface DashboardChartSeries {
    key: string;
    label: string;
    color: string;
}

export interface DashboardChart {
    id: string;
    title: string;
    description: string;
    type: 'area' | 'bar' | 'pie' | 'line' | 'radar';
    x_key?: string;
    name_key?: string;
    value_key?: string;
    layout?: 'horizontal' | 'vertical';
    insight: string;
    series: DashboardChartSeries[];
    data: Record<string, string | number | null>[];
}

export interface DashboardInsight {
    title: string;
    value: string | number;
    description: string;
    tone: 'blue' | 'red';
}

export interface SystemLogEntry {
    id: number;
    user_id?: number | null;
    user_name?: string | null;
    user_type?: string | null;
    action: string;
    resource: string;
    route_name?: string | null;
    method?: string | null;
    url?: string | null;
    ip_address?: string | null;
    summary: string;
    metadata?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface UserMentionPayload {
  title: string
  message: string
  user: string
  timestamp: string
  action_url?: string | null
}

export type NotificationPayloadMap = {
  'App\\Notifications\\ImportReportNotification': ImportReportNotificationPayload
  'App\\Notifications\\PostLikedNotification': PostLikedNotificationPayload
  'App\\Notifications\\EmploymentSurveySubmittedNotification': EmploymentSurveySubmittedNotificationPayload
  'App\\Notifications\\UserMentionNotification': UserMentionPayload
}

export interface AppNotification<T = unknown> { 
	id: string;
	type: string;
	data: T;
	read_at: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}
