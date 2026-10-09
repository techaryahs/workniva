const fs = require('fs');

// Navbar
let navbar = fs.readFileSync('frontend/src/sections/Navbar.tsx', 'utf8');

navbar = navbar.replace(/const \{ isAuthenticated, isAdmin, signOut \} = useAuth\(\);/, `const { isAuthenticated, isAdmin, signOut } = useAuth();
  
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  };`);

navbar = navbar.replace(/<button onClick=\{signOut\}/g, `<button onClick={handleSignOut}`);
navbar = navbar.replace(/<button onClick=\{\(\) => \{ signOut\(\); setIsMobileMenuOpen\(false\); \}\}/, `<button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}`);

fs.writeFileSync('frontend/src/sections/Navbar.tsx', navbar);

// AdminLayout
let admin = fs.readFileSync('frontend/src/layouts/AdminLayout.tsx', 'utf8');

admin = admin.replace(/const \{ user, profile, signOut \} = useAuth\(\);/, `const { user, profile, signOut } = useAuth();

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  };`);

admin = admin.replace(/<LogOut onClick=\{signOut\}/g, `<LogOut onClick={handleSignOut}`);

fs.writeFileSync('frontend/src/layouts/AdminLayout.tsx', admin);

