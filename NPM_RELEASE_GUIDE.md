# NPM Release Guide for GloSPA

## 📋 Complete Release Process

### Prerequisites
- Ensure you have an npm account at [npmjs.com](https://www.npmjs.com/)
- Make sure all changes are committed and pushed to GitHub
- Verify the package.json version is correct

### Step 1: Login to NPM
```bash
npm login
```
- Enter your npm username
- Enter your npm password  
- Enter your email address
- Enter the OTP (One-Time Password) if 2FA is enabled

### Step 2: Verify Login
```bash
npm whoami
```
This should display your npm username if logged in successfully.

### Step 3: Test Package Before Publishing (Optional but Recommended)
```bash
# Check what files will be included in the package
npm pack --dry-run

# Or create a test tarball to inspect
npm pack
```

### Step 4: Publish to NPM
```bash
# For first release
npm publish

# For scoped packages (if needed)
npm publish --access public

# For beta releases
npm publish --tag beta
```

### Step 5: Create Git Tags (Recommended)
```bash
# Create a version tag
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0

# Or push all tags
git push --tags
```

### Step 6: Verify Publication
- Check your package at: `https://www.npmjs.com/package/glospa`
- Test the jsDelivr CDN link: `https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.min.js`

## 🔄 Version Updates and Subsequent Releases

### Update Version
```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)  
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Or manually edit package.json version field
```

### Complete Release Workflow
```bash
# 1. Make your changes and commit them
git add .
git commit -m "Add new features"

# 2. Update version (this also creates a git tag)
npm version patch

# 3. Push changes and tags
git push && git push --tags

# 4. Publish to npm
npm publish
```

## 🚨 Troubleshooting

### Common Issues:

**"Package name already exists"**
- The package name might be taken
- Change the "name" field in package.json to something unique

**"You must be logged in to publish packages"**
- Run `npm login` again
- Check with `npm whoami`

**"403 Forbidden"**
- You might not have permission to publish
- For scoped packages, use `npm publish --access public`

**"Version already exists"**
- Update the version in package.json
- Use `npm version patch/minor/major`

### Unpublish (Use with Caution!)
```bash
# Unpublish a specific version (only within 72 hours)
npm unpublish glospa@1.0.0

# Unpublish entire package (only within 72 hours)
npm unpublish glospa --force
```

## 📊 Package Status Commands

```bash
# View package info
npm info glospa

# View all versions
npm view glospa versions --json

# Check package downloads
npm view glospa

# List your published packages
npm ls --depth=0 -g
```

## 🔗 Useful Links After Publishing

- **NPM Package:** `https://www.npmjs.com/package/glospa`
- **jsDelivr CDN:** `https://cdn.jsdelivr.net/npm/glospa@latest/`
- **Unpkg CDN:** `https://unpkg.com/glospa@latest/`
- **GitHub Releases:** `https://github.com/AllramEst83/GloSPA/releases`

## 📝 Release Checklist

- [ ] All changes committed and pushed to GitHub
- [ ] Version updated in package.json
- [ ] npm login completed
- [ ] npm publish successful
- [ ] Git tag created and pushed
- [ ] GitHub release created (optional)
- [ ] jsDelivr CDN link tested
- [ ] Documentation updated with new version examples

---

*Save this file for future releases!*