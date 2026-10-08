const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/auth/RegisterPage.tsx', 'utf8');

// Add confirm password state
content = content.replace(/const \[password, setPassword\] = useState\(''\);/, "const [password, setPassword] = useState('');\n  const [confirmPassword, setConfirmPassword] = useState('');");

// Update handleRegister
content = content.replace(/const handleRegister = async \(e: React\.FormEvent\) => \{\n    e\.preventDefault\(\);\n    setLoading\(true\);\n    setError\(''\);/, `const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError('');`);

// Add confirm password input field
const passwordBlock = `<div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>`;

const newPasswordBlock = `<div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>`;

content = content.replace(passwordBlock, newPasswordBlock);

fs.writeFileSync('frontend/src/pages/auth/RegisterPage.tsx', content);
