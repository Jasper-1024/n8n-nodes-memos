# n8n-nodes-memos-plus

This is an enhanced n8n community node for Memos with full CRUD operations and filtering support.

> **Note**: This is a fork of [n8n-nodes-memos](https://github.com/laxtiz/n8n-nodes-memos) with additional features.

[Memos](https://www.usememos.com/) is a privacy-first, lightweight note-taking service.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-memos-plus`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-memos-plus
```

## Operations

### Memo Operations
- **List Memos** - List all memos with optional filters (tag, status, content search)
- **Get Memo** - Get a single memo by ID
- **Create Memo** - Create a new memo with content and visibility
- **Update Memo** - Update an existing memo
- **Delete Memo** - Delete a memo

### User Operations
- **List Users** - List all users
- **Get User** - Get a single user

## Credentials

Register a Memos account and create a personal access token.

[Reference](https://www.usememos.com/docs/security/access-tokens)

## Compatibility

Any version

## Usage

1. Create a new workflow.
2. Add a new node.
3. Select the Memos node.
4. Configure the node with your Memos account information.
5. Add the Memos operations you want to use in your workflow.
6. Connect the Memos operations to the other nodes in your workflow.
7. Run your workflow.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Memos documentation](https://www.usememos.com/docs/)
- [Memos API documentation](https://memos.apidocumentation.com/reference)
