export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  userName?: string | null;
  image?: string | null;
}

export interface AuthContext {
  user: SessionUser | null;
  isAuthenticated: boolean;
}
