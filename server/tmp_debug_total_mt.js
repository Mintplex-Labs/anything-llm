const fs=require('fs');
const doc=JSON.parse(fs.readFileSync('/app/server/storage/documents/custom-documents/Gia MT chao - (250136-MTC).pdf-9e70096e-de1b-4399-844d-32ba09cce8ee.json','utf8'));
const text=doc.pageContent||'';
function parseAmountString(amountStr){
  let s=String(amountStr).trim();
  s=s.replace(/(?:VND|VNĐ|USD|EUR|GBP|$|₫)/ig,'');
  s=s.replace(/[^0-9\.,]/g,'');
  if(s.indexOf(',')!==-1 && s.indexOf('.')!==-1){
    if(s.lastIndexOf('.')>s.lastIndexOf(',')) s=s.replace(/,/g,'');
    else s=s.replace(/\./g,'').replace(/,/g,'.');
  } else {
    if(s.indexOf(',')!==-1 && s.indexOf('.')===-1) s=s.replace(/,/g,'');
  }
  const n=parseFloat(s);
  return Number.isFinite(n)?n:NaN;
}
const patterns=[/(?:\b(VND|VNĐ|USD|EUR|GBP|$|₫)\b\s*([\d\.,\s]{4,}))/ig,/(?:grand\s+total)\s*[:\-]?\s*(?:\(?\s*(?:VND|VNĐ|USD|EUR|GBP|$|₫)?\s*\)?\s*([\d\.,\s]+))/ig,/(?:total\s+amount|total)\s*[:\-]?\s*(?:\(?\s*(?:VND|VNĐ|USD|EUR|GBP|$|₫)?\s*\)?\s*([\d\.,\s]+))/ig,/(?:tổng\s+cộng|thành\s+tiền|tổng\s+thành\s+tiền)\s*[:\-]?\s*(?:\(?\s*(?:VND|VNĐ|USD|EUR|GBP|$|₫)?\s*\)?\s*([\d\.,\s]+))/ig,/([\d\.,\s]{4,})\s*(?:VND|VNĐ|USD|EUR|GBP|$|₫)/ig];
let candidates=[];
for(const p of patterns){
  for(const m of text.matchAll(p)){
    let raw='';
    if(m[2]) raw=m[2]; else if(m[1]) raw=m[1]; else raw=(m[0]||'');
    const amt=parseAmountString(raw);
    if(Number.isFinite(amt) && amt>0){
      const window=text.substring(Math.max(0,m.index-40),Math.min(text.length,m.index+(m[0]?m[0].length+40:100)));
      let curMatch=window.match(/(VND|VNĐ|USD|EUR|GBP|$|₫)/i);
      const cur=curMatch?curMatch[0].toUpperCase().replace('VNĐ','VND'):null;
      candidates.push({amt,cur,idx:m.index||0,raw:m[0]});
    }
  }
}
console.log('Found',candidates.length,'candidates');
candidates.sort((a,b)=>a.idx-b.idx);
console.log(JSON.stringify(candidates,null,2));
// Also show large numbers >1,000,000
const large=candidates.filter(c=>c.amt>1000000).sort((a,b)=>b.amt-a.amt);
console.log('Large candidates (desc):',JSON.stringify(large.slice(0,20),null,2));
