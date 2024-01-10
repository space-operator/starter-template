type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Flow = {
  created_at: string;
  current_network: Json;
  custom_networks: Json[];
  description: string;
  edges: Json[] | null;
  environment: Json | null;
  guide: Json | null;
  id: number;
  instructions_bundling: Json;
  isPublic: boolean;
  lastest_flow_run_id: string | null;
  mosaic: Json | null;
  name: string;
  nodes: Array<any>;
  parent_flow: number | null;
  start_shared: boolean;
  start_unverified: boolean;
  tags: string[];
  updated_at: string | null;
  user_id: string;
  uuid: string | null;
  viewport: Json;
};

export type FlowRunResponse = {
  flow_run_id: string;
  token?: string;
};
