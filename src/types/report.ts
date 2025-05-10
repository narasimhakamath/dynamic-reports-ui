export interface ReportField {
  key: string;
  label: string;
  type: string;
}

export interface FilterValue {
  key: string;
  value: string;
}

export interface ReportFilter {
  name: string;
  type: string;
  values: FilterValue[];
  field: string;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  fields: ReportField[];
  filters: ReportFilter[];
  searchable: string[];
}

export interface ReportMetadata {
  deleted: boolean;
  version: {
    release: string;
    document: number;
  };
  createdAt: string;
  lastUpdated: string;
}

export interface ReportDataItem {
  _id: string;
  name: string;
  description: string;
  _metadata: ReportMetadata;
  [key: string]: any;
}

export interface ReportPagination {
  page: number;
  count: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReportData {
  data: ReportDataItem[];
  pagination: ReportPagination;
}