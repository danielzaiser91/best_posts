
export const uniq = (arr: Array<any>): Array<any> => Array.from(new Set([...arr]))

// credit: https://www.30secondsofcode.org/blog/s/javascript-array-comparison
export const deepEquals = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => deepEquals(a[k], b[k]));
};

export const isRobot = (userAgent: string): boolean => {
  const robots = new RegExp(([
    /bot/,/spider/,/crawl/,                               // GENERAL TERMS
    /APIs-Google/,/AdsBot/,/Googlebot/,                   // GOOGLE ROBOTS
    /mediapartners/,/Google Favicon/,
    /FeedFetcher/,/Google-Read-Aloud/,
    /DuplexWeb-Google/,/googleweblight/,
    /bing/,/yandex/,/baidu/,/duckduck/,/yahoo/,           // OTHER ENGINES
    /ecosia/,/ia_archiver/,
    /facebook/,/instagram/,/pinterest/,/reddit/,          // SOCIAL MEDIA
    /slack/,/twitter/,/whatsapp/,/youtube/,
    /semrush/,                                            // OTHER
  ] as RegExp[]).map((r) => r.source).join("|"),"i");     // BUILD REGEXP + "i" FLAG

  return robots.test(userAgent);
};
