export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          compliance_score: number | null;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          compliance_score?: number | null;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          compliance_score?: number | null;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          auth_user_id: string;
          created_at: string;
          email: string;
          id: string;
          organization_id: string;
          role: 'admin' | 'auditor' | 'member';
          updated_at: string;
        };
        Insert: {
          auth_user_id: string;
          created_at?: string;
          email: string;
          id?: string;
          organization_id: string;
          role?: 'admin' | 'auditor' | 'member';
          updated_at?: string;
        };
        Update: {
          auth_user_id?: string;
          created_at?: string;
          email?: string;
          id?: string;
          organization_id?: string;
          role?: 'admin' | 'auditor' | 'member';
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          }
        ];
      };
      documents: {
        Row: {
          category: 'contract' | 'invoice' | 'health_record' | 'legal' | 'unknown';
          created_at: string;
          file_path: string;
          file_size_bytes: number;
          id: string;
          mime_type: string;
          organization_id: string;
          pii_detected: boolean;
          pii_findings: Json;
          risk_level: 'low' | 'medium' | 'high' | 'critical';
          status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
          summary: string | null;
          updated_at: string;
          uploaded_by: string;
        };
        Insert: {
          category?: 'contract' | 'invoice' | 'health_record' | 'legal' | 'unknown';
          created_at?: string;
          file_path: string;
          file_size_bytes: number;
          id?: string;
          mime_type: string;
          organization_id: string;
          pii_detected?: boolean;
          pii_findings?: Json;
          risk_level?: 'low' | 'medium' | 'high' | 'critical';
          status?: 'uploaded' | 'processing' | 'analyzed' | 'failed';
          summary?: string | null;
          updated_at?: string;
          uploaded_by: string;
        };
        Update: {
          category?: 'contract' | 'invoice' | 'health_record' | 'legal' | 'unknown';
          created_at?: string;
          file_path?: string;
          file_size_bytes?: number;
          id?: string;
          mime_type?: string;
          organization_id?: string;
          pii_detected?: boolean;
          pii_findings?: Json;
          risk_level?: 'low' | 'medium' | 'high' | 'critical';
          status?: 'uploaded' | 'processing' | 'analyzed' | 'failed';
          summary?: string | null;
          updated_at?: string;
          uploaded_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_uploaded_by_fkey';
            columns: ['uploaded_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      document_embeddings: {
        Row: {
          chunk_index: number;
          content: string;
          created_at: string;
          document_id: string;
          embedding: string;
          id: string;
          organization_id: string;
          token_count: number;
        };
        Insert: {
          chunk_index: number;
          content: string;
          created_at?: string;
          document_id: string;
          embedding: string;
          id?: string;
          organization_id: string;
          token_count: number;
        };
        Update: {
          chunk_index?: number;
          content?: string;
          created_at?: string;
          document_id?: string;
          embedding?: string;
          id?: string;
          organization_id?: string;
          token_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'document_embeddings_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'document_embeddings_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          }
        ];
      };
      tags: {
        Row: {
          confidence: number;
          created_at: string;
          document_id: string;
          id: string;
          source: 'ai' | 'user';
          tag: string;
        };
        Insert: {
          confidence?: number;
          created_at?: string;
          document_id: string;
          id?: string;
          source?: 'ai' | 'user';
          tag: string;
        };
        Update: {
          confidence?: number;
          created_at?: string;
          document_id?: string;
          id?: string;
          source?: 'ai' | 'user';
          tag?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tags_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          }
        ];
      };
      audit_logs: {
        Row: {
          action_type: 'upload' | 'view' | 'download' | 'edit' | 'delete' | 'analyze' | 'search';
          browser_user_agent: string | null;
          created_at: string;
          document_id: string | null;
          id: string;
          ip_address: string | null;
          metadata: Json;
          organization_id: string;
          user_id: string;
        };
        Insert: {
          action_type: 'upload' | 'view' | 'download' | 'edit' | 'delete' | 'analyze' | 'search';
          browser_user_agent?: string | null;
          created_at?: string;
          document_id?: string | null;
          id?: string;
          ip_address?: string | null;
          metadata?: Json;
          organization_id: string;
          user_id: string;
        };
        Update: {
          action_type?: 'upload' | 'view' | 'download' | 'edit' | 'delete' | 'analyze' | 'search';
          browser_user_agent?: string | null;
          created_at?: string;
          document_id?: string | null;
          id?: string;
          ip_address?: string | null;
          metadata?: Json;
          organization_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_logs_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audit_logs_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audit_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_document_chunks: {
        Args: {
          query_embedding: string;
          target_org_id: string;
          match_count?: number;
        };
        Returns: {
          id: string;
          document_id: string;
          content: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      action_type: 'upload' | 'view' | 'download' | 'edit' | 'delete' | 'analyze' | 'search';
      document_category: 'contract' | 'invoice' | 'health_record' | 'legal' | 'unknown';
      document_status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
      risk_level: 'low' | 'medium' | 'high' | 'critical';
      user_role: 'admin' | 'auditor' | 'member';
    };
    CompositeTypes: Record<string, never>;
  };
};
