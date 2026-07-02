const fs = require('fs');
const path = require('path');

async function updatePage() {
  const filePath = path.join(__dirname, '../src/lib/pages/caseStudiesPage.json');
  const pageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log("Fetching pages from API...");
  const getRes = await fetch('https://kalptree.xyz/api/cms/pages', {
    headers: {
      'x-tenant-db': 'kp_codified_web_solution'
    }
  });
  
  if (!getRes.ok) {
    console.error("Failed to fetch:", await getRes.text());
    return;
  }
  
  const resData = await getRes.json();
  const pages = resData.data;
  
  const caseStudiesPage = pages.find(p => p.slug === 'case-studies');
  
  if (caseStudiesPage) {
    const pageId = caseStudiesPage.id || caseStudiesPage._id;
    console.log(`Found case studies page with id: ${pageId}. Updating via PUT...`);
    
    const putRes = await fetch(`https://kalptree.xyz/api/cms/pages/${pageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-db': 'kp_codified_web_solution'
      },
      body: JSON.stringify(pageData)
    });
    
    if (!putRes.ok) {
      console.error("Failed to update:", await putRes.text());
      return;
    }
    
    console.log("Successfully updated page via API.");
  } else {
    console.log("Case studies page not found in API. Creating via POST...");
    
    const postRes = await fetch('https://kalptree.xyz/api/cms/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-db': 'kp_codified_web_solution'
      },
      body: JSON.stringify(pageData)
    });
    
    if (!postRes.ok) {
      console.error("Failed to create page:", await postRes.text());
      return;
    }
    
    const postData = await postRes.json();
    console.log("Successfully created case-studies page via API:", postData);
  }
}

updatePage().catch(console.error);
