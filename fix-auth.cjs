const fs = require('fs');
let content = fs.readFileSync('frontend/src/contexts/AuthContext.tsx', 'utf8');
content = content.replace(/const fetchProfile = async \(userId: string\) => \{[\s\S]*?console\.error\('Error fetching profile:', err\);\n    \}\n  \};/m, `const fetchProfile = async (userId: string) => {
    try {
      const profileData = await fetchApi('/auth/me');
      if (profileData) {
        setProfile(profileData as Profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };`);
fs.writeFileSync('frontend/src/contexts/AuthContext.tsx', content);
