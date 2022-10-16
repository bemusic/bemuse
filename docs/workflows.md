---
id: workflows
title: Workflows for development, release, and deployment
sidebar_label: Workflows
---

This page describes the workflow for:

- Merging PRs
- Releasing new versions

## Merging PRs

We use a semi-automated [release-train](https://github.com/bemusic/release-train) script to generate a release candidate.

1. For each pull request that is ready to be merged:

   - Label the pull requests with "c:ready" label.

   - Add this to the description:

      ```
      ### Changelog

      (Put the change log here)
      ```


2. Run the ["Trigger release train"](https://github.com/bemusic/release-train/actions/workflows/trigger.yml) workflow in GitHub Actions.

    - A new pull request for the release candidate will be generated, combining all the PRs with "c:ready" label into a single PR, along with the change log update.

3. If the release candidate is accepted, then merge the pull request and continue with release. Otherwise, close it.

## Release a new version

If any refinement is needed in the CHANGELOG, they can be edited on the `master` branch directly.

Once a release candidate is accepted, we should release it to everyone. To promote the latest release candidate to an actual release, run:

```
node build-scripts release
```

## Deploying to production

Upon releasing a new version, it will automatically be deployed to production.

## Publishing npm packages

Right now this is done manually using this command:

```
rush publish --apply --target-branch master --publish --npm-auth-token $NPM_TOKEN
```