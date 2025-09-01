# Contributing to AnythingLLM

AnythingLLM is an open-source project and we welcome contributions from the community.

## Reporting Issues

If you encounter a bug or have a feature request, please open an issue on the
[GitHub issue tracker](https://github.com/mintplex-labs/anything-llm).

## Picking an issue

We track issues on the GitHub issue tracker. If you are looking for something to
work on, check the [good first issue](https://github.com/mintplex-labs/anything-llm/contribute) label. These issues are typically the best described and have the smallest scope. There may be issues that are not labeled as good first issue, but are still a good starting point.

If there's an issue you are interested in working on, please leave a comment on the issue. This will help us avoid duplicate work. Additionally, if you have questions about the issue, please ask them in the issue comments. We are happy to provide guidance on how to approach the issue.

## Before you start

Keep in mind that we are a small team and have limited resources. We will do our best to review and merge your PRs, but please be patient. Ultimately, **we become the maintainer** of your changes. It is our responsibility to make sure that the changes are working as expected and are of high quality as well as being compatible with the rest of the project both for existing users and for future users & features.

Before you start working on an issue, please read the following so that you don't waste time on something that is not a good fit for the project or is more suitable for a personal fork. We would rather answer a comment on an issue than close a PR after you've spent time on it. Your time is valuable and we appreciate your time and effort to make AnythingLLM better.

0. (most important) If you are making a PR that does not have a corresponding issue, **it will not be merged.** _The only exception to this is language translations._

1. If you are modifying the permission system for a new role or something custom, you are likely better off forking the project and building your own version since this is a core part of the project and is only to be maintained by the AnythingLLM team.

2. Integrations (LLM, Vector DB, etc.) are reviewed at our discretion. We will eventually get to them. Do not expect us to merge your integration PR instantly since there are often many moving parts and we want to make sure we get it right. We will get to it!

3. It is our discretion to merge or not merge a PR. We value every contribution, but we also value the quality of the code and the user experience we envision for the project. It is a fine line to walk when running a project like this and please understand that merging or not merging a PR is not a reflection of the quality of the contribution and is not personal. We will do our best to provide feedback on the PR and help you make the changes necessary to get it merged.

4. **Security** is always important. If you have a security concern, please do not open an issue. Instead, please open a CVE on our designated reporting platform [Huntr](https://huntr.com) or contact us at [team@mintplexlabs.com](mailto:team@mintplexlabs.com).

## Configuring Git

First, fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/<username>/anything-llm.git
cd anything-llm
```

Then add the main repository as a remote:

```bash
git remote add upstream https://github.com/mintplex-labs/anything-llm.git
git fetch upstream
```

## Setting up your development environment

In the root of the repository, run:

```bash
yarn setup
```

This will install the dependencies, set up the proper and expected ENV files for the project, and run the prisma setup script.
Next, run:

```bash
yarn dev:all
```
This will start the server, frontend, and collector in development mode. Changes to the code will be hot reloaded.

## Best practices for pull requests

For the best chance of having your pull request accepted, please follow these guidelines:

1. Unit test all bug fixes and new features. Your code will not be merged if it
   doesn't have tests.
1. If you change the public API, update the documentation in the `anythingllm-docs` repository.
1. Aim to minimize the number of changes in each pull request. Keep to solving
   one problem at a time, when possible.
1. Before marking a pull request ready-for-review, do a self review of your code.
   Is it clear why you are making the changes? Are the changes easy to understand?
1. Use [conventional commit messages](https://www.conventionalcommits.org/en/) as pull request titles. Examples:
    * New feature: `feat: adding foo API`
    * Bug fix: `fix: issue with foo API`
    * Documentation change: `docs: adding foo API documentation`
1. If your pull request is a work in progress, leave the pull request as a draft.
   We will assume the pull request is ready for review when it is opened.
1. When writing tests, test the error cases. Make sure they have understandable
   error messages.

## Project structure

The core library is written in Node.js. There are additional sub-repositories for the embed widget and browser extension. These are not part of the core AnythingLLM project, but are maintained by the AnythingLLM team.

* `server`: Node.js server source code
* `frontend`: React frontend source code
* `collector`: Python collector source code

## Release process

Changes to the core AnythingLLM project are released through the `master` branch. When a PR is merged into `master`, a new version of the package is published to Docker and GitHub Container Registry under the `latest` tag.

When a new version is released, the following steps are taken a new image is built and pushed to Docker Hub and GitHub Container Registry under the assoicated version tag. Version tags are of the format `v<major>.<minor>.<patch>` and are pinned code, while `latest` is the latest version of the code at any point in time.

### Desktop propogation

Changes to the desktop app are downstream of the core AnythingLLM project. Releases of the desktop app are published at the same time as the core AnythingLLM project. Code from the core AnythingLLM project is copied into the desktop app into an Electron wrapper. The Electron wrapper that wraps around the core AnythingLLM project is **not** part of the core AnythingLLM project, but is maintained by the AnythingLLM team.

## License

By contributing to AnythingLLM (this repository), you agree to license your contributions under the MIT license.