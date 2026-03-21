interface Session {
    user: {
      id: string;
      // ...existing code...
    } & DefaultSession["user"];
  }