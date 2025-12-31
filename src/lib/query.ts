// URL param helpers
export function getParam(
  params: URLSearchParams, 
  key: string, fallback: string
) {
 return params.get(key) ?? fallback;    
}

export function setParams(
  params: URLSearchParams,
  updates: Record<string, string | null>   
) {
 const next = new URLSearchParams(params.toString());
 
 Object.entries(updates).forEach(([key, value]) => {
  if (value === null) next.delete(key);
  else next.set(key, value);
 });

 return next.toString();
}