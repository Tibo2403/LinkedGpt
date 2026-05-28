# Demo Media Plan

Store screenshots and GIFs in `docs/media/`.

Recommended captures:

- `docs/media/dashboard.png` - main app dashboard in demo mode.
- `docs/media/post-generator.png` - post generation result.
- `docs/media/outreach.png` - connection or follow-up message workflow.
- `docs/media/analytics.png` - metrics and engagement view.
- `docs/media/demo-flow.gif` - 30 second flow from prompt to generated post.

Before recording:

```powershell
$env:VITE_DEMO_MODE="true"
npm run demo
```

Run quality checks before publishing media:

```bash
npm run check
```

