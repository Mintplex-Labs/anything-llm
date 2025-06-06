# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated Docker image building and deployment.

## Workflows

### 1. `docker-build-push.yml` - Main Build and Push Workflow

**Triggers:**
- Push to `main` or `master` branch
- Git tags starting with `v` (e.g., `v1.0.0`)
- Pull requests to `main` or `master` (build only, no push)
- Ignores documentation and configuration changes

**Features:**
- Multi-architecture builds (AMD64 and ARM64)
- Automatic tagging based on Git refs
- Pushes to GitHub Container Registry (ghcr.io)
- Optional DockerHub publishing (if secrets are configured)
- Docker layer caching for faster builds
- SBOM (Software Bill of Materials) generation
- Provenance attestations for supply chain security
- VEX (Vulnerability Exploitability eXchange) attestations for CVE exceptions
- Docker Scout integration for security scanning
- Concurrency control to cancel previous builds

**Image Tags:**
- `latest` - for pushes to default branch
- `<version>` - for Git tags (e.g., `1.0.0` for tag `v1.0.0`)
- `<major>.<minor>` - for Git tags (e.g., `1.0` for tag `v1.0.0`)
- `<major>` - for Git tags (e.g., `1` for tag `v1.0.0`)
- `<branch-name>` - for pushes to other branches

### 2. `docker-test-build.yml` - Test Build Workflow

**Triggers:**
- Pull requests that modify Docker-related files
- Changes to server, frontend, collector, or workflow files

**Features:**
- Matrix builds for different platforms
- Build-only testing (no registry push)
- Platform-specific caching

## Usage

### Automatic Builds

The workflows run automatically when:
1. You push code to the main branch
2. You create a Git tag for releases
3. Someone opens a pull request

### Manual Release

To create a new release:

```bash
# Tag your release
git tag v1.0.0
git push origin v1.0.0
```

This will trigger a build and push images with tags:
- `ghcr.io/your-username/your-repo:latest`
- `ghcr.io/your-username/your-repo:1.0.0`
- `ghcr.io/your-username/your-repo:1.0`
- `ghcr.io/your-username/your-repo:1`

### Using the Images

Pull and run your built images:

```bash
# Pull the latest image
docker pull ghcr.io/your-username/your-repo:latest

# Run the container
docker run -p 3001:3001 ghcr.io/your-username/your-repo:latest
```

## Configuration

### Required Permissions

The workflows use the built-in `GITHUB_TOKEN` with these permissions:
- `contents: read` - to checkout the repository
- `packages: write` - to push to GitHub Container Registry

### Optional DockerHub Integration

To also push to DockerHub, add these repository secrets:
- `DOCKER_USERNAME` - Your DockerHub username
- `DOCKER_PASSWORD` - Your DockerHub password or access token

### Build Arguments

The Docker build uses these arguments:
- `ARG_UID=1000` - User ID for the container user
- `ARG_GID=1000` - Group ID for the container user

### Security Features

- **SBOM Generation**: Creates Software Bill of Materials for dependency tracking
- **Provenance Attestations**: Provides build provenance for supply chain security
- **VEX Attestations**: Handles CVE exceptions using files in `docker/vex/` directory
- **Docker Scout**: Automated security scanning and vulnerability reporting

## Troubleshooting

### Build Failures

1. **Permission Issues**: Ensure your repository has GitHub Packages enabled
2. **Docker Build Errors**: Check the Dockerfile syntax and build context
3. **Platform Issues**: ARM64 builds may take longer due to emulation

### Registry Access

Images are pushed to:
- `ghcr.io/OWNER/REPOSITORY` (GitHub Container Registry)
- `DOCKER_USERNAME/REPOSITORY` (DockerHub, if configured)

Where:
- `OWNER` is your GitHub username or organization
- `REPOSITORY` is your repository name
- `DOCKER_USERNAME` is your DockerHub username

Make sure the repository visibility settings allow package access.

### Performance Optimizations

- **Path Filtering**: Builds only trigger when relevant files change
- **Concurrency Control**: Cancels previous builds when new ones start
- **Layer Caching**: Uses GitHub Actions cache for faster subsequent builds
- **QEMU Emulation**: Enables cross-platform builds for ARM64 architecture
