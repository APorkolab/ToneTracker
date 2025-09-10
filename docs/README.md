# 📚 ToneTracker Documentation

Welcome to the ToneTracker documentation! This directory contains comprehensive guides for deployment, development, and maintenance.

## 📖 Available Guides

### 🚀 [Deployment Guide](./DEPLOYMENT.md)
Complete guide covering:
- CI/CD pipeline architecture
- GitHub Actions workflow configuration  
- Performance monitoring and bundle analysis
- Troubleshooting common deployment issues
- Security considerations

**Use this when:** Setting up automated deployment, configuring CI/CD, or debugging deployment issues.

### 📖 [GitHub Pages Setup](./GITHUB_PAGES.md)
Quick reference for GitHub Pages:
- Initial repository setup
- Custom domain configuration
- DNS settings and verification
- Common troubleshooting steps
- Quick status checks

**Use this when:** Setting up GitHub Pages for the first time, configuring custom domains, or troubleshooting site access issues.

## 🎯 Quick Start

### For First-Time Deployment

1. **Enable GitHub Pages:**
   - Go to repo Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (auto-created by CI/CD)

2. **Configure Custom Domain:**
   - Add `tonetracker.app` in Pages settings
   - Verify CNAME file exists in repo root
   - Wait for DNS propagation (24-48 hours)

3. **Trigger Deployment:**
   - Push to `main` branch, or
   - Manually trigger from Actions tab

### For Troubleshooting

1. **Check Build Status:** Actions tab for CI/CD logs
2. **Verify DNS:** `dig tonetracker.app A` should show GitHub IPs
3. **Test Locally:** `npm run build && npm run preview`

## 🏗️ Architecture Overview

```
ToneTracker Deployment Pipeline
├── 📥 Code Push (main branch)
├── 🔍 Quality Checks (ESLint, tests, coverage)
├── 🎭 E2E Tests (Playwright)
├── 🏗️ Production Build (Vite)
├── 📋 Build Validation (files, CNAME)
├── 📊 Performance Audit (Lighthouse)
└── 🚀 GitHub Pages Deploy (gh-pages branch)
```

## 📊 Key Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| Bundle Size (JS) | < 250kb | Fast loading |
| Bundle Size (CSS) | < 50kb | Quick styling |
| Lighthouse Score | > 90 | User experience |
| Test Coverage | > 80% | Code quality |
| Load Time | < 3s | Performance |

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `CNAME` | Custom domain for GitHub Pages |
| `.github/workflows/ci-cd.yml` | Automated CI/CD pipeline |
| `vite.config.js` | Build and development configuration |
| `package.json` | Dependencies and npm scripts |

## 🚦 Status Indicators

### ✅ Healthy Deployment
- GitHub Actions show green checkmarks
- Site loads at https://tonetracker.app
- No console errors in browser
- Performance metrics within targets

### ⚠️ Warning Signs  
- Bundle size warnings in CI
- Lighthouse score < 90
- Slow load times (> 3 seconds)
- Test coverage dropping

### 🚨 Issues Requiring Attention
- CI/CD pipeline failures
- Site returning 404 errors
- Domain not resolving
- Build failures or errors

## 📞 Support Resources

### Internal Documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide
- [GITHUB_PAGES.md](./GITHUB_PAGES.md) - GitHub Pages quick reference

### External Resources
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)  
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Debug Commands

```bash
# Test build locally
npm run build && npm run preview

# Check all quality gates
npm run lint && npm run test:run

# Performance analysis
npm run performance:audit

# DNS verification
dig tonetracker.app A
nslookup tonetracker.app
```

## 🤝 Contributing

When updating documentation:

1. **Keep it current:** Update guides when configuration changes
2. **Test examples:** Verify all commands and procedures work
3. **Clear language:** Use simple, actionable language
4. **Version control:** Document version-specific information

## 📄 Documentation Status

| Guide | Last Updated | Status |
|-------|-------------|---------|
| DEPLOYMENT.md | 2024-01-10 | ✅ Current |
| GITHUB_PAGES.md | 2024-01-10 | ✅ Current |
| README.md | 2024-01-10 | ✅ Current |

---

**🎯 Quick Check:** Visit [tonetracker.app](https://tonetracker.app) to verify deployment!
