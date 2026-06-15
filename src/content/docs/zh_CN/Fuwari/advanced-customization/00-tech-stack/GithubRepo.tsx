import React, { useEffect, useState } from 'react';

interface RepoData {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
}

export default function GithubRepo({ repo }: { repo: string }) {
  const [data, setData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [repo]);

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center rounded-xl border border-border bg-card/50 my-4 animate-pulse">
        <span className="opacity-50 text-sm">Loading GitHub Data...</span>
      </div>
    );
  }

  if (!data || data.name === undefined) {
    return (
      <div className="w-full h-32 flex items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 my-4">
        <span className="text-destructive text-sm">Failed to load repository data.</span>
      </div>
    );
  }

  return (
    <a 
      href={data.html_url} 
      target="_blank" 
      rel="noreferrer"
      className="block w-full rounded-xl border border-border bg-card hover:bg-card/80 transition-all duration-300 p-5 my-4 group no-underline"
    >
      <div className="flex items-center gap-2 text-primary font-bold text-lg mb-2 group-hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        {repo}
      </div>
      <p className="text-sm opacity-80 mb-4 line-clamp-2 m-0 text-[var(--color-text)]">
        {data.description || 'No description provided.'}
      </p>
      <div className="flex items-center gap-4 text-xs font-medium opacity-70">
        {data.language && (
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-primary"><circle cx="12" cy="12" r="10"/></svg>
            {data.language}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {data.stargazers_count}
        </div>
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
          {data.forks_count}
        </div>
      </div>
    </a>
  );
}
