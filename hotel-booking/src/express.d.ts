declare global {
  namespace Express {
    interface Request {
      logout(callback?: (err: any) => void): void;
      isAuthenticated(): boolean;
      user: any; // можно уточнить тип, если известен
    }
  }
}
