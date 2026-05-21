const websiteHtml = String.raw`<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Terrasat Jamming Detection</title>
	<style>
		:root {
			--bg: #06131d;
			--panel: rgba(8, 27, 41, 0.78);
			--panel-strong: rgba(10, 35, 53, 0.92);
			--line: rgba(120, 194, 232, 0.18);
			--line-strong: rgba(120, 194, 232, 0.34);
			--text: #e7f6ff;
			--muted: #97b9ca;
			--accent: #4fd1c5;
			--accent-strong: #f4b942;
			--danger: #ff7a7a;
			--success: #74f0a7;
			--shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
			--radius-xl: 28px;
			--radius-lg: 20px;
			--radius-md: 14px;
			--bg-main:
				radial-gradient(circle at 15% 15%, rgba(79, 209, 197, 0.16), transparent 28%),
				radial-gradient(circle at 85% 12%, rgba(244, 185, 66, 0.14), transparent 22%),
				radial-gradient(circle at 50% 120%, rgba(63, 153, 210, 0.22), transparent 42%),
				linear-gradient(180deg, #05111a 0%, #071925 55%, #041019 100%);
		}

		* {
			box-sizing: border-box;
		}

		html {
			scroll-behavior: smooth;
		}

		body {
			margin: 0;
			min-height: 100vh;
			font-family: "Aptos", "Segoe UI", sans-serif;
			background: var(--bg-main);
			color: var(--text);
			overflow-x: hidden;
		}

		html[data-theme="light"],
		body[data-theme="light"] {
			--text: #132130;
			--muted: #41586a;
			--line: rgba(23, 84, 117, 0.17);
			--line-strong: rgba(23, 84, 117, 0.3);
			--panel: rgba(255, 255, 255, 0.82);
			--panel-strong: rgba(255, 255, 255, 0.96);
			--shadow: 0 20px 60px rgba(13, 53, 77, 0.12);
			--bg-main:
				radial-gradient(circle at 15% 15%, rgba(79, 209, 197, 0.2), transparent 28%),
				radial-gradient(circle at 85% 12%, rgba(244, 185, 66, 0.18), transparent 24%),
				radial-gradient(circle at 50% 120%, rgba(63, 153, 210, 0.2), transparent 42%),
				linear-gradient(180deg, #f2fbff 0%, #eef8ff 55%, #f7fdff 100%);
		}

		body::before,
		body::after {
			content: "";
			position: fixed;
			inset: auto;
			pointer-events: none;
			z-index: 0;
		}

		body::before {
			width: 42vw;
			height: 42vw;
			top: -12vw;
			right: -10vw;
			background: radial-gradient(circle, rgba(79, 209, 197, 0.12), transparent 68%);
			filter: blur(12px);
		}

		body::after {
			width: 34vw;
			height: 34vw;
			bottom: -12vw;
			left: -12vw;
			background: radial-gradient(circle, rgba(244, 185, 66, 0.12), transparent 70%);
			filter: blur(10px);
		}

		a {
			color: inherit;
			text-decoration: none;
		}

		img {
			display: block;
			max-width: 100%;
		}

		.page-shell {
			position: relative;
			z-index: 1;
			width: min(1200px, calc(100% - 32px));
			margin: 0 auto;
			padding: 24px 0 40px;
		}

		.nav {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			padding: 14px 18px;
			margin-bottom: 20px;
			border: 1px solid var(--line);
			background: rgba(4, 18, 28, 0.58);
			backdrop-filter: blur(18px);
			border-radius: 999px;
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
		}

		.brand {
			display: flex;
			align-items: center;
			gap: 14px;
		}

		.brand-mark {
			width: 42px;
			height: 42px;
			border-radius: 14px;
			background:
				linear-gradient(135deg, rgba(79, 209, 197, 0.9), rgba(63, 153, 210, 0.9));
			box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16), 0 10px 25px rgba(79, 209, 197, 0.22);
			position: relative;
			overflow: hidden;
		}

		.brand-mark::before,
		.brand-mark::after {
			content: "";
			position: absolute;
			inset: 9px;
			border-radius: 10px;
			border: 1px solid rgba(255, 255, 255, 0.28);
		}

		.brand-mark::after {
			inset: auto 7px 7px auto;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.78);
			border: 0;
		}

		.brand-copy strong {
			display: block;
			font-size: 0.98rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.brand-copy span {
			display: block;
			color: var(--muted);
			font-size: 0.84rem;
		}

		.nav-links {
			display: flex;
			align-items: center;
			gap: 10px;
			flex-wrap: wrap;
		}

		.nav-links a {
			padding: 10px 14px;
			color: var(--muted);
			font-size: 0.95rem;
			border-radius: 999px;
			transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
		}

		.nav-links a:hover {
			background: rgba(79, 209, 197, 0.1);
			color: var(--text);
			transform: translateY(-1px);
		}

		.theme-toggle {
			padding: 10px 14px;
			border-radius: 999px;
			font-size: 0.9rem;
			color: var(--text);
			background: rgba(255, 255, 255, 0.04);
			border: 1px solid var(--line-strong);
		}

		.theme-state {
			display: inline-flex;
			align-items: center;
			padding: 10px 12px;
			border-radius: 999px;
			font-size: 0.85rem;
			color: var(--muted);
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid var(--line);
		}

		.lang-select {
			padding: 10px 12px;
			border-radius: 999px;
			font-size: 0.86rem;
			color: var(--text);
			background: rgba(255, 255, 255, 0.04);
			border: 1px solid var(--line-strong);
		}

		.zoom-trigger {
			padding: 6px 10px;
			font-size: 0.78rem;
			border-radius: 999px;
			color: var(--text);
			background: rgba(255, 255, 255, 0.04);
			border: 1px solid rgba(255, 255, 255, 0.1);
		}

		.zoom-modal {
			position: fixed;
			inset: 0;
			z-index: 50;
			display: grid;
			place-items: center;
			padding: 18px;
			background: rgba(4, 14, 22, 0.82);
			backdrop-filter: blur(6px);
		}

		.zoom-modal.hidden {
			display: none;
		}

		.zoom-shell {
			width: min(1120px, 96vw);
			height: min(84vh, 860px);
			display: grid;
			grid-template-rows: auto 1fr;
			gap: 10px;
			padding: 12px;
			border-radius: 20px;
			border: 1px solid var(--line);
			background: var(--panel-strong);
			box-shadow: var(--shadow);
		}

		.zoom-toolbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			flex-wrap: wrap;
		}

		.zoom-title {
			font-size: 0.9rem;
			color: var(--muted);
		}

		.zoom-actions {
			display: flex;
			align-items: center;
			gap: 8px;
		}

		.zoom-btn {
			padding: 8px 12px;
			font-size: 0.84rem;
			border-radius: 999px;
			border: 1px solid var(--line-strong);
			background: rgba(255, 255, 255, 0.04);
			color: var(--text);
		}

		.zoom-stage {
			position: relative;
			overflow: hidden;
			border-radius: 14px;
			border: 1px solid var(--line);
			background: rgba(0, 0, 0, 0.22);
			cursor: grab;
		}

		.zoom-stage.dragging {
			cursor: grabbing;
		}

		#zoomImage {
			position: absolute;
			top: 50%;
			left: 50%;
			transform-origin: center center;
			max-width: none;
			user-select: none;
			pointer-events: none;
		}

		.hero {
			display: grid;
			grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
			gap: 22px;
			align-items: stretch;
			margin-bottom: 22px;
		}

		.card {
			background: linear-gradient(180deg, rgba(9, 30, 45, 0.9), rgba(7, 20, 31, 0.86));
			border: 1px solid var(--line);
			border-radius: var(--radius-xl);
			box-shadow: var(--shadow);
		}

		.hero-copy {
			padding: 34px;
			position: relative;
			overflow: hidden;
		}

		.hero-copy::before {
			content: "";
			position: absolute;
			top: -40px;
			right: -40px;
			width: 220px;
			height: 220px;
			border-radius: 50%;
			background: radial-gradient(circle, rgba(79, 209, 197, 0.22), transparent 68%);
		}

		.eyebrow {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 8px 12px;
			border-radius: 999px;
			background: rgba(79, 209, 197, 0.12);
			border: 1px solid rgba(79, 209, 197, 0.2);
			color: #b7fbf1;
			font-size: 0.82rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.eyebrow::before {
			content: "";
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: var(--accent);
			box-shadow: 0 0 16px rgba(79, 209, 197, 0.8);
		}

		h1 {
			margin: 18px 0 14px;
			max-width: 11ch;
			font-size: clamp(2.9rem, 5vw, 5.4rem);
			line-height: 0.94;
			letter-spacing: -0.05em;
		}

		.hero-copy p {
			max-width: 62ch;
			margin: 0;
			color: var(--muted);
			font-size: 1.03rem;
			line-height: 1.7;
		}

		.hero-actions {
			display: flex;
			align-items: center;
			gap: 12px;
			flex-wrap: wrap;
			margin-top: 24px;
		}

		.button,
		button {
			border: 0;
			border-radius: 999px;
			padding: 13px 18px;
			font: inherit;
			cursor: pointer;
			transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease, background-color 180ms ease;
		}

		.button:hover,
		button:hover {
			transform: translateY(-1px);
		}

		.button-primary,
		#analyzeButton {
			color: #041019;
			font-weight: 700;
			background: linear-gradient(135deg, var(--accent), #9ef5ec);
			box-shadow: 0 16px 32px rgba(79, 209, 197, 0.24);
		}

		.button-secondary {
			color: var(--text);
			background: rgba(255, 255, 255, 0.04);
			border: 1px solid var(--line-strong);
		}

		.hero-metrics {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 12px;
			margin-top: 28px;
		}

		.metric {
			padding: 14px;
			border-radius: 18px;
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.05);
		}

		.metric strong {
			display: block;
			font-size: 1.4rem;
			margin-bottom: 6px;
		}

		.metric span {
			color: var(--muted);
			font-size: 0.9rem;
		}

		.signal-panel {
			padding: 28px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			min-height: 100%;
			background:
				linear-gradient(180deg, rgba(8, 24, 38, 0.94), rgba(6, 19, 30, 0.94)),
				linear-gradient(120deg, rgba(79, 209, 197, 0.12), transparent 36%);
		}

		.signal-grid {
			display: grid;
			gap: 12px;
			margin-top: 18px;
		}

		.signal-chip {
			padding: 16px;
			border-radius: 18px;
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.06);
		}

		.signal-chip .label {
			color: var(--muted);
			text-transform: uppercase;
			letter-spacing: 0.08em;
			font-size: 0.78rem;
			margin-bottom: 6px;
		}

		.signal-chip strong {
			display: block;
			font-size: 1.2rem;
			margin-bottom: 4px;
		}

		.signal-chip span {
			color: #c6deea;
			font-size: 0.92rem;
		}

		.scanline {
			margin-top: 22px;
			height: 110px;
			border-radius: 20px;
			border: 1px solid var(--line);
			background:
				linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent),
				repeating-linear-gradient(
					90deg,
					rgba(79, 209, 197, 0.08) 0,
					rgba(79, 209, 197, 0.08) 2px,
					transparent 2px,
					transparent 48px
				),
				linear-gradient(90deg, rgba(79, 209, 197, 0.12), rgba(63, 153, 210, 0.3), rgba(244, 185, 66, 0.16));
			position: relative;
			overflow: hidden;
		}

		.scanline::before {
			content: "";
			position: absolute;
			top: 0;
			bottom: 0;
			left: -20%;
			width: 18%;
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
			animation: sweep 4.8s linear infinite;
		}

		.section-grid {
			display: grid;
			grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
			gap: 22px;
			margin-bottom: 22px;
		}

		.upload-card,
		.result-card,
		.info-card {
			padding: 28px;
		}

		.section-title {
			margin: 0 0 8px;
			font-size: 1.45rem;
			letter-spacing: -0.03em;
		}

		.section-copy {
			margin: 0;
			color: var(--muted);
			line-height: 1.7;
		}

		.dropzone {
			position: relative;
			display: grid;
			place-items: center;
			margin-top: 22px;
			min-height: 250px;
			padding: 20px;
			border: 1.5px dashed rgba(79, 209, 197, 0.34);
			border-radius: 24px;
			background:
				linear-gradient(180deg, rgba(79, 209, 197, 0.08), rgba(255, 255, 255, 0.02)),
				rgba(255, 255, 255, 0.02);
			text-align: center;
			transition: border-color 180ms ease, background-color 180ms ease, transform 180ms ease;
		}

		.dropzone.drag-over {
			border-color: rgba(244, 185, 66, 0.7);
			background:
				linear-gradient(180deg, rgba(244, 185, 66, 0.12), rgba(255, 255, 255, 0.03)),
				rgba(255, 255, 255, 0.03);
			transform: translateY(-1px);
		}

		.dropzone input {
			position: absolute;
			inset: 0;
			opacity: 0;
			cursor: pointer;
		}

		.dropzone-inner {
			max-width: 28rem;
		}

		.dropzone-icon {
			width: 74px;
			height: 74px;
			margin: 0 auto 18px;
			border-radius: 22px;
			display: grid;
			place-items: center;
			background: rgba(79, 209, 197, 0.12);
			border: 1px solid rgba(79, 209, 197, 0.22);
			font-size: 1.8rem;
		}

		.dropzone h3 {
			margin: 0 0 10px;
			font-size: 1.25rem;
		}

		.dropzone p {
			margin: 0;
			color: var(--muted);
			line-height: 1.6;
		}

		.upload-meta {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			flex-wrap: wrap;
			margin-top: 18px;
		}

		.filename {
			color: #d8eef8;
			font-size: 0.95rem;
		}

		.status {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 10px 12px;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.04);
			color: var(--muted);
			font-size: 0.9rem;
			border: 1px solid rgba(255, 255, 255, 0.05);
		}

		.status::before {
			content: "";
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: currentColor;
		}

		.status.ok {
			color: var(--success);
		}

		.status.warn {
			color: var(--accent-strong);
		}

		.status.error {
			color: var(--danger);
		}

		.control-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			flex-wrap: wrap;
			margin-top: 22px;
		}

		.helper-text {
			color: var(--muted);
			font-size: 0.92rem;
		}

		.preview-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 16px;
			margin-top: 22px;
		}

		.analysis-tools {
			display: grid;
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
			gap: 16px;
			margin-top: 16px;
		}

		.summary-panel,
		.history-panel {
			padding: 16px;
			border-radius: 20px;
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.06);
		}

		.summary-panel h3,
		.history-panel h3 {
			margin: 0 0 10px;
			font-size: 1rem;
		}

		.summary-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}

		.summary-item {
			padding: 10px;
			border-radius: 14px;
			background: rgba(0, 0, 0, 0.12);
			border: 1px solid rgba(255, 255, 255, 0.04);
		}

		.summary-item span {
			display: block;
			font-size: 0.74rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--muted);
			margin-bottom: 5px;
		}

		.summary-item strong {
			display: block;
			font-size: 0.93rem;
		}

		.export-row,
		.history-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 10px;
			flex-wrap: wrap;
		}

		.export-row {
			margin-top: 12px;
		}

		.mini-note {
			color: var(--muted);
			font-size: 0.82rem;
			line-height: 1.5;
		}

		#exportButton,
		#clearHistoryButton {
			padding: 9px 13px;
			font-size: 0.88rem;
		}

		.history-list {
			list-style: none;
			padding: 0;
			margin: 10px 0 0;
			display: grid;
			gap: 8px;
			max-height: 220px;
			overflow: auto;
		}

		.history-empty {
			padding: 10px;
			border-radius: 12px;
			background: rgba(0, 0, 0, 0.12);
			border: 1px solid rgba(255, 255, 255, 0.04);
			font-size: 0.86rem;
			color: var(--muted);
		}

		.history-item {
			width: 100%;
			text-align: left;
			padding: 11px;
			border-radius: 12px;
			border: 1px solid rgba(255, 255, 255, 0.08);
			background: rgba(0, 0, 0, 0.14);
			color: var(--text);
		}

		.history-item strong {
			display: block;
			font-size: 0.88rem;
			margin-bottom: 4px;
		}

		.history-item span {
			display: block;
			color: var(--muted);
			font-size: 0.8rem;
		}

		.preview-panel {
			background: rgba(0, 0, 0, 0.18);
			border: 1px solid rgba(255, 255, 255, 0.06);
			border-radius: 22px;
			overflow: hidden;
			min-height: 260px;
			display: flex;
			flex-direction: column;
		}

		.preview-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			padding: 14px 16px;
			border-bottom: 1px solid rgba(255, 255, 255, 0.06);
			background: rgba(255, 255, 255, 0.03);
		}

		.preview-header strong {
			font-size: 0.95rem;
		}

		.preview-tag {
			font-size: 0.76rem;
			text-transform: uppercase;
			letter-spacing: 0.08em;
			color: var(--muted);
		}

		.preview-stage {
			flex: 1;
			display: grid;
			place-items: center;
			padding: 16px;
			min-height: 220px;
		}

		.preview-stage img {
			width: 100%;
			max-height: 420px;
			object-fit: contain;
			border-radius: 16px;
		}

		.empty-state {
			max-width: 18rem;
			text-align: center;
			color: var(--muted);
			line-height: 1.7;
		}

		.workflow-list {
			display: grid;
			gap: 12px;
			margin-top: 20px;
		}

		.workflow-item {
			display: grid;
			grid-template-columns: 42px minmax(0, 1fr);
			gap: 14px;
			align-items: start;
			padding: 14px;
			border-radius: 18px;
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.05);
		}

		.workflow-index {
			width: 42px;
			height: 42px;
			border-radius: 14px;
			display: grid;
			place-items: center;
			font-weight: 700;
			color: #041019;
			background: linear-gradient(135deg, #9ef5ec, #f4b942);
		}

		.workflow-item strong {
			display: block;
			margin-bottom: 4px;
		}

		.workflow-item p {
			margin: 0;
			color: var(--muted);
			line-height: 1.6;
		}

		.footer-bar {
			display: flex;
			justify-content: space-between;
			gap: 16px;
			flex-wrap: wrap;
			margin-top: 18px;
			padding: 18px 22px;
			border-radius: 22px;
			border: 1px solid var(--line);
			background: rgba(4, 16, 25, 0.66);
		}

		.footer-bar span {
			color: var(--muted);
		}

		html[data-theme="light"] .nav,
		body[data-theme="light"] .nav {
			background: rgba(255, 255, 255, 0.72);
		}

		html[data-theme="light"] .card,
		body[data-theme="light"] .card {
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(240, 250, 255, 0.86));
		}

		html[data-theme="light"] .signal-panel,
		body[data-theme="light"] .signal-panel {
			background:
				linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(236, 248, 255, 0.9)),
				linear-gradient(120deg, rgba(79, 209, 197, 0.12), transparent 36%);
		}

		html[data-theme="light"] .metric,
		html[data-theme="light"] .signal-chip,
		html[data-theme="light"] .summary-panel,
		html[data-theme="light"] .history-panel,
		html[data-theme="light"] .workflow-item,
		html[data-theme="light"] .preview-panel,
		html[data-theme="light"] .summary-item,
		html[data-theme="light"] .history-item,
		html[data-theme="light"] .history-empty,
		body[data-theme="light"] .metric,
		body[data-theme="light"] .signal-chip,
		body[data-theme="light"] .summary-panel,
		body[data-theme="light"] .history-panel,
		body[data-theme="light"] .workflow-item,
		body[data-theme="light"] .preview-panel,
		body[data-theme="light"] .summary-item,
		body[data-theme="light"] .history-item,
		body[data-theme="light"] .history-empty {
			background: rgba(255, 255, 255, 0.78);
			border-color: rgba(23, 84, 117, 0.12);
		}

		html[data-theme="light"] .dropzone,
		body[data-theme="light"] .dropzone {
			background:
				linear-gradient(180deg, rgba(79, 209, 197, 0.12), rgba(255, 255, 255, 0.8)),
				rgba(255, 255, 255, 0.8);
		}

		html[data-theme="light"] .preview-header,
		html[data-theme="light"] .footer-bar,
		body[data-theme="light"] .preview-header,
		body[data-theme="light"] .footer-bar {
			background: rgba(255, 255, 255, 0.66);
		}

		html[data-theme="light"] .button-secondary,
		html[data-theme="light"] .theme-toggle,
		html[data-theme="light"] .theme-state,
		html[data-theme="light"] .lang-select,
		html[data-theme="light"] .zoom-trigger,
		html[data-theme="light"] .zoom-btn,
		body[data-theme="light"] .button-secondary,
		body[data-theme="light"] .theme-toggle,
		body[data-theme="light"] .theme-state,
		body[data-theme="light"] .lang-select,
		body[data-theme="light"] .zoom-trigger,
		body[data-theme="light"] .zoom-btn {
			background: rgba(255, 255, 255, 0.72);
		}

		.hidden {
			display: none !important;
		}

		@keyframes sweep {
			from {
				transform: translateX(0);
			}
			to {
				transform: translateX(720%);
			}
		}

		@media (max-width: 1024px) {
			.hero,
			.section-grid {
				grid-template-columns: 1fr;
			}

			h1 {
				max-width: 13ch;
			}
		}

		@media (max-width: 720px) {
			.page-shell {
				width: min(100% - 20px, 1200px);
				padding-top: 14px;
			}

			.nav {
				border-radius: 26px;
				padding: 14px;
			}

			.nav,
			.brand,
			.nav-links,
			.hero-actions,
			.hero-metrics,
			.preview-grid,
			.analysis-tools,
			.summary-grid,
			.control-row,
			.upload-meta,
			.footer-bar {
				flex-direction: column;
				align-items: stretch;
			}

			.hero-copy,
			.signal-panel,
			.upload-card,
			.result-card,
			.info-card {
				padding: 22px;
			}

			.hero-metrics,
			.preview-grid {
				display: grid;
				grid-template-columns: 1fr;
			}

			.analysis-tools,
			.summary-grid {
				display: grid;
				grid-template-columns: 1fr;
			}

			h1 {
				font-size: clamp(2.5rem, 11vw, 4rem);
			}

			.dropzone {
				min-height: 220px;
			}
		}
	</style>
</head>
<body>
	<div class="page-shell">
		<nav class="nav">
			<div class="brand">
				<div class="brand-mark" aria-hidden="true"></div>
				<div class="brand-copy">
					<strong>Terrasat Radar Lab</strong>
					<span>Jamming Detection Console</span>
				</div>
			</div>
			<div class="nav-links">
				<a href="#analyzer" id="navAnalyzer">Analyzer</a>
				<a href="#workflow" id="navWorkflow">Workflow</a>
				<a href="/docs" id="navDocs">API Docs</a>
				<select id="languageSelect" class="lang-select" aria-label="Language selector">
					<option value="en">EN</option>
					<option value="tr">TR</option>
					<option value="es">ES</option>
					<option value="de">DE</option>
				</select>
				<span id="themeState" class="theme-state">Current theme: dark</span>
				<button id="themeToggle" class="theme-toggle" type="button" aria-label="Toggle dark or light theme">Light theme</button>
			</div>
		</nav>

		<section class="hero">
			<article class="card hero-copy">
				<div class="eyebrow">Live Spectrum Intelligence</div>
				<h1>See jamming before it hides in the noise.</h1>
				<p>
					This console turns a raw spectrogram into an operator-ready view of interference activity.
					Upload a capture, run the detector, and inspect the annotated output generated by the current
					FastAPI pipeline.
				</p>
				<div class="hero-actions">
					<a class="button button-primary" href="#analyzer">Open Analyzer</a>
					<a class="button button-secondary" href="/health">Check API Health</a>
				</div>
				<div class="hero-metrics">
					<div class="metric">
						<strong>2</strong>
						<span>monitored GNSS targets</span>
					</div>
					<div class="metric">
						<strong>50 MHz</strong>
						<span>current scan frequency window</span>
					</div>
					<div class="metric">
						<strong>PNG out</strong>
						<span>annotated figure response</span>
					</div>
				</div>
			</article>

			<aside class="card signal-panel">
				<div>
					<p class="eyebrow">Tracked Bands</p>
					<div class="signal-grid">
						<div class="signal-chip">
							<div class="label">Target 01</div>
							<strong>1268.52 MHz</strong>
							<span>B3I / BDS-II monitoring band</span>
						</div>
						<div class="signal-chip">
							<div class="label">Target 02</div>
							<strong>1278.75 MHz</strong>
							<span>E6 Galileo / L6 QZSS monitoring band</span>
						</div>
						<div class="signal-chip">
							<div class="label">Detector Mode</div>
							<strong>Hot-pixel contouring</strong>
							<span>Morphology + contour merge + target-specific annotations</span>
						</div>
					</div>
				</div>
				<div class="scanline" aria-hidden="true"></div>
			</aside>
		</section>

		<section class="section-grid" id="analyzer">
			<article class="card upload-card">
				<h2 class="section-title">Spectrogram Intake</h2>
				<p class="section-copy">
					Drop a spectrogram image here or browse from disk. The file is sent to the existing
					<code>/analyze</code> endpoint as multipart form data and returned as an annotated PNG.
				</p>

				<label class="dropzone" id="dropzone">
					<input id="fileInput" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp" />
					<div class="dropzone-inner">
						<div class="dropzone-icon">+</div>
						<h3>Drag in a spectrogram capture</h3>
						<p>
							PNG and JPEG are the safest formats. The detector decodes the image, isolates hot regions,
							and overlays target-specific labels on the output figure.
						</p>
					</div>
				</label>

				<div class="upload-meta">
					<div class="filename" id="filename">No file selected.</div>
					<div class="status warn" id="statusBadge">Waiting for input</div>
				</div>

				<div class="control-row">
					<div class="helper-text">Local preview appears immediately. Analysis runs only when you submit.</div>
					<button id="analyzeButton" type="button">Run Detection</button>
				</div>
			</article>

			<article class="card result-card">
				<h2 class="section-title">Detection Output</h2>
				<p class="section-copy">
					Compare the incoming capture with the generated response. The output image includes the original
					view, the hot-pixel mask, and the final event overlay from the current backend model.
				</p>

				<div class="preview-grid">
					<section class="preview-panel">
						<div class="preview-header">
							<strong id="inputPreviewTitle">Input Preview</strong>
							<button id="zoomInputButton" class="zoom-trigger" type="button">Zoom/Pan</button>
							<span class="preview-tag">Local image</span>
						</div>
						<div class="preview-stage" id="inputPreviewStage">
							<div class="empty-state">Select a spectrogram image to inspect what will be sent to the detector.</div>
							<img id="inputPreviewImage" class="hidden" alt="Input spectrogram preview" />
						</div>
					</section>

					<section class="preview-panel">
						<div class="preview-header">
							<strong id="resultPreviewTitle">Annotated Result</strong>
							<button id="zoomResultButton" class="zoom-trigger" type="button">Zoom/Pan</button>
							<span class="preview-tag">API response</span>
						</div>
						<div class="preview-stage" id="resultPreviewStage">
							<div class="empty-state" id="resultPlaceholder">Run the detector to render the annotated jamming analysis output.</div>
							<img id="resultPreviewImage" class="hidden" alt="Annotated jamming result" />
						</div>
					</section>
				</div>

				<div class="analysis-tools">
					<section class="summary-panel">
						<h3>Detection Summary</h3>
						<div class="summary-grid">
							<div class="summary-item">
								<span>Run ID</span>
								<strong id="summaryRunId">Not started</strong>
							</div>
							<div class="summary-item">
								<span>Status</span>
								<strong id="summaryStatus">Idle</strong>
							</div>
							<div class="summary-item">
								<span>Input Dimensions</span>
								<strong id="summaryInputDims">-</strong>
							</div>
							<div class="summary-item">
								<span>API Latency</span>
								<strong id="summaryLatency">-</strong>
							</div>
							<div class="summary-item">
								<span>Output Size</span>
								<strong id="summaryOutputSize">-</strong>
							</div>
							<div class="summary-item">
								<span>Last Processed</span>
								<strong id="summaryTimestamp">-</strong>
							</div>
						</div>
						<div class="export-row">
							<div class="mini-note" id="summaryBandInfo">Targets: 1268.52 MHz and 1278.75 MHz monitored by backend pipeline.</div>
							<button id="exportButton" class="button-secondary" type="button" disabled>Export PNG + metadata</button>
						</div>
					</section>

					<section class="history-panel">
						<div class="history-header">
							<h3>Session History</h3>
							<button id="clearHistoryButton" class="button-secondary" type="button">Clear</button>
						</div>
						<ul class="history-list" id="historyList">
							<li class="history-empty" id="historyEmpty">No completed analyses yet.</li>
						</ul>
					</section>
				</div>
			</article>
		</section>

		<section class="section-grid" id="workflow">
			<article class="card info-card">
				<h2 class="section-title">Operator Workflow</h2>
				<p class="section-copy">
					The interface stays thin on purpose. It is a front end over the Python detection pipeline already
					in this repository, so the UI shows exactly what the backend is producing.
				</p>
				<div class="workflow-list">
					<div class="workflow-item">
						<div class="workflow-index">1</div>
						<div>
							<strong>Load capture</strong>
							<p>Choose a spectrogram snapshot exported from your data workflow or manual analysis set.</p>
						</div>
					</div>
					<div class="workflow-item">
						<div class="workflow-index">2</div>
						<div>
							<strong>Submit to detector</strong>
							<p>The browser sends the image as multipart form data to the FastAPI <code>/analyze</code> endpoint.</p>
						</div>
					</div>
					<div class="workflow-item">
						<div class="workflow-index">3</div>
						<div>
							<strong>Review annotated output</strong>
							<p>Inspect hot-mask behavior, merged detections, and target-specific labels in a single returned PNG.</p>
						</div>
					</div>
				</div>
			</article>

			<article class="card info-card">
				<h2 class="section-title">Backend Status</h2>
				<p class="section-copy">
					This panel reflects whether the FastAPI app is reachable from the browser. It checks the existing
					health endpoint and updates live when the page loads.
				</p>
				<div class="workflow-list">
					<div class="workflow-item">
						<div class="workflow-index">A</div>
						<div>
							<strong>Health endpoint</strong>
							<p id="healthText">Checking <code>/health</code> for API availability.</p>
						</div>
					</div>
					<div class="workflow-item">
						<div class="workflow-index">B</div>
						<div>
							<strong>Response type</strong>
							<p>Successful analysis returns an <code>image/png</code> payload that this UI renders inline.</p>
						</div>
					</div>
					<div class="workflow-item">
						<div class="workflow-index">C</div>
						<div>
							<strong>Error surface</strong>
							<p id="errorGuide">Validation and decode failures are shown directly in the status area.</p>
						</div>
					</div>
				</div>
			</article>
		</section>

		<footer class="footer-bar">
			<span>Terrasat Jamming Detection project UI</span>
			<span>Built against the current FastAPI detection service</span>
		</footer>
	</div>

	<div id="zoomModal" class="zoom-modal hidden" role="dialog" aria-modal="true" aria-label="Zoom and pan viewer">
		<div class="zoom-shell">
			<div class="zoom-toolbar">
				<div id="zoomModalTitle" class="zoom-title">Zoom viewer</div>
				<div class="zoom-actions">
					<button id="zoomOutButton" class="zoom-btn" type="button">-</button>
					<button id="zoomResetButton" class="zoom-btn" type="button">Reset</button>
					<button id="zoomInButton" class="zoom-btn" type="button">+</button>
					<button id="zoomCloseButton" class="zoom-btn" type="button">Close</button>
				</div>
			</div>
			<div id="zoomStage" class="zoom-stage">
				<img id="zoomImage" alt="Zoomed preview" />
			</div>
		</div>
	</div>

	<script>
		const fileInput = document.getElementById("fileInput");
		const dropzone = document.getElementById("dropzone");
		const filename = document.getElementById("filename");
		const analyzeButton = document.getElementById("analyzeButton");
		const statusBadge = document.getElementById("statusBadge");
		const inputPreviewImage = document.getElementById("inputPreviewImage");
		const resultPreviewImage = document.getElementById("resultPreviewImage");
		const resultPlaceholder = document.getElementById("resultPlaceholder");
		const inputPreviewStage = document.getElementById("inputPreviewStage");
		const healthText = document.getElementById("healthText");
		const errorGuide = document.getElementById("errorGuide");
		const themeState = document.getElementById("themeState");
		const themeToggle = document.getElementById("themeToggle");
		const languageSelect = document.getElementById("languageSelect");
		const navAnalyzer = document.getElementById("navAnalyzer");
		const navWorkflow = document.getElementById("navWorkflow");
		const navDocs = document.getElementById("navDocs");
		const inputPreviewTitle = document.getElementById("inputPreviewTitle");
		const resultPreviewTitle = document.getElementById("resultPreviewTitle");
		const zoomInputButton = document.getElementById("zoomInputButton");
		const zoomResultButton = document.getElementById("zoomResultButton");
		const zoomModal = document.getElementById("zoomModal");
		const zoomModalTitle = document.getElementById("zoomModalTitle");
		const zoomStage = document.getElementById("zoomStage");
		const zoomImage = document.getElementById("zoomImage");
		const zoomInButton = document.getElementById("zoomInButton");
		const zoomOutButton = document.getElementById("zoomOutButton");
		const zoomResetButton = document.getElementById("zoomResetButton");
		const zoomCloseButton = document.getElementById("zoomCloseButton");
		const exportButton = document.getElementById("exportButton");
		const clearHistoryButton = document.getElementById("clearHistoryButton");
		const historyList = document.getElementById("historyList");
		const historyEmpty = document.getElementById("historyEmpty");
		const summaryRunId = document.getElementById("summaryRunId");
		const summaryStatus = document.getElementById("summaryStatus");
		const summaryInputDims = document.getElementById("summaryInputDims");
		const summaryLatency = document.getElementById("summaryLatency");
		const summaryOutputSize = document.getElementById("summaryOutputSize");
		const summaryTimestamp = document.getElementById("summaryTimestamp");
		const summaryBandInfo = document.getElementById("summaryBandInfo");
		const footerLeft = document.querySelector(".footer-bar span:first-child");
		const footerRight = document.querySelector(".footer-bar span:last-child");

		let selectedFile = null;
		let inputPreviewUrl = null;
		let resultPreviewUrl = null;
		let runCounter = 0;
		let lastRunMeta = null;
		const sessionHistory = [];
		const THEME_STORAGE_KEY = "terrasat-theme";
		const LANGUAGE_STORAGE_KEY = "terrasat-language";
		let currentLanguage = "en";
		let zoomState = { scale: 1, tx: 0, ty: 0, dragging: false, startX: 0, startY: 0, source: "" };

		const translations = {
			en: {
				navAnalyzer: "Analyzer",
				navWorkflow: "Workflow",
				navDocs: "API Docs",
				zoomPan: "Zoom/Pan",
				inputPreview: "Input Preview",
				annotatedResult: "Annotated Result",
				exportText: "Export PNG + metadata",
				clearText: "Clear",
				zoomViewer: "Zoom viewer",
				zoomReset: "Reset",
				zoomClose: "Close",
				footerLeft: "Terrasat Jamming Detection project UI",
				footerRight: "Built against the current FastAPI detection service",
				themeCurrent: "Current theme",
				themeToLight: "Light theme",
				themeToDark: "Dark theme",
				statusNoZoomImage: "No image available for zoom",
				summaryNotStarted: "Not started",
				summaryIdle: "Idle",
				summaryBandInfoDefault: "Targets: 1268.52 MHz and 1278.75 MHz monitored by backend pipeline.",
				summaryBandInfoSource: "Source",
				summaryBandInfoEndpoint: "Endpoint",
				historyRunPrefix: "Run",
				statusReady: "Ready to analyze",
				errorGuideDefault: "Validation and decode failures are shown directly in the status area.",
				summaryStatusReady: "Ready",
				summaryReadingImage: "Reading image",
				statusChooseFile: "Choose a file first",
				statusRunning: "Running detection",
				errorRequestInFlight: "The request is in flight. Waiting for an image/png response from the API.",
				errorDetectorDefault: "The detector returned an error.",
				summaryStatusCompleted: "Completed",
				summaryStatusFailed: "Failed",
				summaryUnknown: "Unknown",
				statusComplete: "Detection complete",
				errorApiOkGuide: "The API returned a PNG successfully. Review the annotated output in the panel above.",
				statusFailed: "Analysis failed",
				errorUnknown: "Unknown error while calling the detector.",
				statusNoRunToExport: "No completed run to export",
				statusExportDone: "Export complete",
				statusHistoryLoaded: "Loaded run",
				statusHistoryCleared: "History cleared",
				backendHealthOk: "API reachable. The service responded with status ok.",
				backendHealthFail: "API unavailable from the browser"
			},
			tr: {
				navAnalyzer: "Analiz",
				navWorkflow: "Is Akisi",
				navDocs: "API Dokuman",
				zoomPan: "Yakinlastir/Kaydir",
				inputPreview: "Girdi Onizleme",
				annotatedResult: "Isaretli Sonuc",
				exportText: "PNG + metadata disa aktar",
				clearText: "Temizle",
				zoomViewer: "Yakinlastirma goruntuleyici",
				zoomReset: "Sifirla",
				zoomClose: "Kapat",
				footerLeft: "Terrasat Karistirma Tespiti proje arayuzu",
				footerRight: "Mevcut FastAPI tespit servisi ile calisir",
				themeCurrent: "Aktif tema",
				themeToLight: "Acik tema",
				themeToDark: "Koyu tema",
				statusNoZoomImage: "Yakinlastirma icin gorsel yok",
				summaryNotStarted: "Baslamadi",
				summaryIdle: "Bosta",
				summaryBandInfoDefault: "Hedefler: 1268.52 MHz ve 1278.75 MHz arka ucta izleniyor.",
				summaryBandInfoSource: "Kaynak",
				summaryBandInfoEndpoint: "Ucta",
				historyRunPrefix: "Calisma",
				statusReady: "Analize hazir",
				errorGuideDefault: "Dogrulama ve decode hatalari dogrudan durum alaninda gosterilir.",
				summaryStatusReady: "Hazir",
				summaryReadingImage: "Gorsel okunuyor",
				statusChooseFile: "Once bir dosya secin",
				statusRunning: "Tespit calisiyor",
				errorRequestInFlight: "Istek gonderildi. API'den image/png yaniti bekleniyor.",
				errorDetectorDefault: "Tespitci bir hata dondurdu.",
				summaryStatusCompleted: "Tamamlandi",
				summaryStatusFailed: "Basarisiz",
				summaryUnknown: "Bilinmiyor",
				statusComplete: "Tespit tamamlandi",
				errorApiOkGuide: "API PNG dondu. Ust panelde isaretli ciktiyi inceleyin.",
				statusFailed: "Analiz basarisiz",
				errorUnknown: "Tespit cagrisi sirasinda bilinmeyen hata.",
				statusNoRunToExport: "Disa aktarim icin tamamlanan calisma yok",
				statusExportDone: "Disa aktarma tamamlandi",
				statusHistoryLoaded: "Gecmisten yuklendi",
				statusHistoryCleared: "Gecmis temizlendi",
				backendHealthOk: "API erisilebilir. Servis status ok dondu.",
				backendHealthFail: "API tarayicidan erisilemiyor"
			},
			es: {
				navAnalyzer: "Analizador",
				navWorkflow: "Flujo",
				navDocs: "Docs API",
				zoomPan: "Zoom/Desplazar",
				inputPreview: "Vista de entrada",
				annotatedResult: "Resultado anotado",
				exportText: "Exportar PNG + metadatos",
				clearText: "Limpiar",
				zoomViewer: "Visor de zoom",
				zoomReset: "Reiniciar",
				zoomClose: "Cerrar",
				footerLeft: "UI del proyecto de deteccion de jamming Terrasat",
				footerRight: "Construido sobre el servicio FastAPI actual",
				themeCurrent: "Tema actual",
				themeToLight: "Tema claro",
				themeToDark: "Tema oscuro",
				statusNoZoomImage: "No hay imagen para hacer zoom",
				summaryNotStarted: "No iniciado",
				summaryIdle: "En espera",
				summaryBandInfoDefault: "Objetivos: 1268.52 MHz y 1278.75 MHz monitorizados por el backend.",
				summaryBandInfoSource: "Fuente",
				summaryBandInfoEndpoint: "Endpoint",
				historyRunPrefix: "Ejecucion",
				statusReady: "Listo para analizar",
				errorGuideDefault: "Los errores de validacion y decodificacion se muestran en el estado.",
				summaryStatusReady: "Listo",
				summaryReadingImage: "Leyendo imagen",
				statusChooseFile: "Primero elige un archivo",
				statusRunning: "Analizando",
				errorRequestInFlight: "Solicitud enviada. Esperando respuesta image/png del API.",
				errorDetectorDefault: "El detector devolvio un error.",
				summaryStatusCompleted: "Completado",
				summaryStatusFailed: "Fallido",
				summaryUnknown: "Desconocido",
				statusComplete: "Deteccion completada",
				errorApiOkGuide: "El API devolvio un PNG. Revisa el resultado anotado arriba.",
				statusFailed: "Fallo el analisis",
				errorUnknown: "Error desconocido al llamar al detector.",
				statusNoRunToExport: "No hay ejecucion completada para exportar",
				statusExportDone: "Exportacion completada",
				statusHistoryLoaded: "Ejecucion cargada",
				statusHistoryCleared: "Historial limpiado",
				backendHealthOk: "API disponible. El servicio respondio con status ok.",
				backendHealthFail: "API no disponible desde el navegador"
			},
			de: {
				navAnalyzer: "Analyse",
				navWorkflow: "Ablauf",
				navDocs: "API Doku",
				zoomPan: "Zoom/Verschieben",
				inputPreview: "Eingabevorschau",
				annotatedResult: "Annotiertes Ergebnis",
				exportText: "PNG + Metadaten exportieren",
				clearText: "Leeren",
				zoomViewer: "Zoom-Ansicht",
				zoomReset: "Zuruecksetzen",
				zoomClose: "Schliessen",
				footerLeft: "Terrasat Jamming-Erkennung Projekt-UI",
				footerRight: "Basierend auf dem aktuellen FastAPI-Service",
				themeCurrent: "Aktives Thema",
				themeToLight: "Helles Thema",
				themeToDark: "Dunkles Thema",
				statusNoZoomImage: "Kein Bild zum Zoomen verfuegbar",
				summaryNotStarted: "Nicht gestartet",
				summaryIdle: "Leerlauf",
				summaryBandInfoDefault: "Ziele: 1268.52 MHz und 1278.75 MHz werden vom Backend ueberwacht.",
				summaryBandInfoSource: "Quelle",
				summaryBandInfoEndpoint: "Endpoint",
				historyRunPrefix: "Lauf",
				statusReady: "Bereit zur Analyse",
				errorGuideDefault: "Validierungs- und Dekodierungsfehler werden im Statusbereich angezeigt.",
				summaryStatusReady: "Bereit",
				summaryReadingImage: "Bild wird gelesen",
				statusChooseFile: "Waehle zuerst eine Datei",
				statusRunning: "Erkennung laeuft",
				errorRequestInFlight: "Anfrage laeuft. Warte auf image/png Antwort vom API.",
				errorDetectorDefault: "Der Detektor hat einen Fehler zurueckgegeben.",
				summaryStatusCompleted: "Abgeschlossen",
				summaryStatusFailed: "Fehlgeschlagen",
				summaryUnknown: "Unbekannt",
				statusComplete: "Erkennung abgeschlossen",
				errorApiOkGuide: "Das API hat ein PNG zurueckgegeben. Pruefe das annotierte Ergebnis oben.",
				statusFailed: "Analyse fehlgeschlagen",
				errorUnknown: "Unbekannter Fehler beim Aufruf des Detektors.",
				statusNoRunToExport: "Kein abgeschlossener Lauf zum Exportieren",
				statusExportDone: "Export abgeschlossen",
				statusHistoryLoaded: "Lauf aus Verlauf geladen",
				statusHistoryCleared: "Verlauf geleert",
				backendHealthOk: "API erreichbar. Dienst antwortete mit status ok.",
				backendHealthFail: "API aus dem Browser nicht erreichbar"
			}
		};

		const STATIC_TEXT_TR = {
			"Terrasat Radar Lab": "Terrasat Radar Lab",
			"Jamming Detection Console": "Karistirma Tespit Konsolu",
			"Live Spectrum Intelligence": "Canli Spektrum Istihbarati",
			"See jamming before it hides in the noise.": "Karistirmayi gurultude kaybolmadan gorun.",
			"This console turns a raw spectrogram into an operator-ready view of interference activity. Upload a capture, run the detector, and inspect the annotated output generated by the current FastAPI pipeline.": "Bu konsol ham spektrogrami operator odakli bir girisim gorunumune cevirir. Bir goruntu yukleyin, tespiti calistirin ve mevcut FastAPI hattinin uretdigi isaretli ciktiyi inceleyin.",
			"Open Analyzer": "Analizi Ac",
			"Check API Health": "API Sagligini Kontrol Et",
			"monitored GNSS targets": "izlenen GNSS hedefi",
			"current scan frequency window": "mevcut tarama frekans penceresi",
			"annotated figure response": "isaretli cizim cikisi",
			"Tracked Bands": "Izlenen Bantlar",
			"Target 01": "Hedef 01",
			"B3I / BDS-II monitoring band": "B3I / BDS-II izleme bandi",
			"Target 02": "Hedef 02",
			"E6 Galileo / L6 QZSS monitoring band": "E6 Galileo / L6 QZSS izleme bandi",
			"Detector Mode": "Tespit Modu",
			"Hot-pixel contouring": "Sicak piksel konturlama",
			"Morphology + contour merge + target-specific annotations": "Morfoloji + kontur birlestirme + hedefe ozel etiketleme",
			"Spectrogram Intake": "Spektrogram Girisi",
			"Drop a spectrogram image here or browse from disk. The file is sent to the existing /analyze endpoint as multipart form data and returned as an annotated PNG.": "Buraya bir spektrogram gorseli birakin veya diskten secin. Dosya multipart form-data olarak mevcut /analyze uc noktasina gonderilir ve isaretli PNG olarak doner.",
			"Drag in a spectrogram capture": "Spektrogram kaydi surukleyin",
			"PNG and JPEG are the safest formats. The detector decodes the image, isolates hot regions, and overlays target-specific labels on the output figure.": "PNG ve JPEG en guvenli formatlardir. Tespitci goruntuyu cozer, sicak bolgeleri ayirir ve cikti uzerine hedefe ozel etiketler ekler.",
			"No file selected.": "Dosya secilmedi.",
			"Waiting for input": "Girdi bekleniyor",
			"Local preview appears immediately. Analysis runs only when you submit.": "Yerel onizleme hemen gorunur. Analiz yalnizca gonderdiginde calisir.",
			"Run Detection": "Tespiti Calistir",
			"Detection Output": "Tespit Ciktisi",
			"Compare the incoming capture with the generated response. The output image includes the original view, the hot-pixel mask, and the final event overlay from the current backend model.": "Gelen goruntu ile uretilen sonucu karsilastirin. Cikti gorseli orijinal gorunumu, sicak-piksel maskesini ve son olay bindirmesini icerir.",
			"Input Preview": "Girdi Onizleme",
			"Local image": "Yerel gorsel",
			"Select a spectrogram image to inspect what will be sent to the detector.": "Tespitciye gonderilecek goruntuyu incelemek icin bir spektrogram secin.",
			"Annotated Result": "Isaretli Sonuc",
			"API response": "API yaniti",
			"Run the detector to render the annotated jamming analysis output.": "Isaretli karistirma analizini olusturmak icin tespitciyi calistirin.",
			"Detection Summary": "Tespit Ozeti",
			"Run ID": "Calisma ID",
			"Status": "Durum",
			"Input Dimensions": "Girdi Boyutlari",
			"API Latency": "API Gecikmesi",
			"Output Size": "Cikti Boyutu",
			"Last Processed": "Son Isleme Zamani",
			"Session History": "Oturum Gecmisi",
			"No completed analyses yet.": "Henuz tamamlanan analiz yok.",
			"Operator Workflow": "Operator Akisi",
			"The interface stays thin on purpose. It is a front end over the Python detection pipeline already in this repository, so the UI shows exactly what the backend is producing.": "Arayuz bilincli olarak hafif tutuldu. Bu sayfa depodaki Python tespit hattinin on yuzudur ve arka ucun tam olarak ne uretdigini gosterir.",
			"Load capture": "Kaydi yukle",
			"Choose a spectrogram snapshot exported from your data workflow or manual analysis set.": "Veri akisinizdan veya manuel analiz setinizden bir spektrogram goruntusu secin.",
			"Submit to detector": "Tespitciye gonder",
			"The browser sends the image as multipart form data to the FastAPI /analyze endpoint.": "Tarayici gorseli multipart form-data olarak FastAPI /analyze uc noktasina gonderir.",
			"Review annotated output": "Isaretli ciktiyi incele",
			"Inspect hot-mask behavior, merged detections, and target-specific labels in a single returned PNG.": "Sicak maske davranisini, birlesmis tespitleri ve hedef etiketlerini tek PNG icinde inceleyin.",
			"Backend Status": "Arka Uc Durumu",
			"This panel reflects whether the FastAPI app is reachable from the browser. It checks the existing health endpoint and updates live when the page loads.": "Bu panel FastAPI uygulamasinin tarayicidan erisilebilir olup olmadigini gosterir. Mevcut saglik uc noktasini kontrol eder ve sayfa yuklenince guncellenir.",
			"Health endpoint": "Saglik uc noktasi",
			"Response type": "Yanit tipi",
			"Successful analysis returns an image/png payload that this UI renders inline.": "Basarili analiz image/png payload doner ve bu arayuzde gosterilir.",
			"Error surface": "Hata alani",
			"Validation and decode failures are shown directly in the status area.": "Dogrulama ve decode hatalari dogrudan durum alaninda gosterilir.",
			"Zoom and pan viewer": "Yakinlastirma ve kaydirma goruntuleyici"
		};

		const STATIC_TEXT_ES = {
			"Terrasat Radar Lab": "Terrasat Radar Lab",
			"Jamming Detection Console": "Consola de deteccion de jamming",
			"Live Spectrum Intelligence": "Inteligencia espectral en vivo",
			"See jamming before it hides in the noise.": "Detecta el jamming antes de que se esconda en el ruido.",
			"This console turns a raw spectrogram into an operator-ready view of interference activity. Upload a capture, run the detector, and inspect the annotated output generated by the current FastAPI pipeline.": "Esta consola convierte un espectrograma en bruto en una vista operativa de la actividad de interferencia. Sube una captura, ejecuta el detector y revisa la salida anotada generada por el pipeline FastAPI actual.",
			"Open Analyzer": "Abrir analizador",
			"Check API Health": "Comprobar salud del API",
			"monitored GNSS targets": "objetivos GNSS monitorizados",
			"current scan frequency window": "ventana de frecuencia actual",
			"annotated figure response": "respuesta de figura anotada",
			"Tracked Bands": "Bandas monitorizadas",
			"Target 01": "Objetivo 01",
			"B3I / BDS-II monitoring band": "Banda de monitorizacion B3I / BDS-II",
			"Target 02": "Objetivo 02",
			"E6 Galileo / L6 QZSS monitoring band": "Banda de monitorizacion E6 Galileo / L6 QZSS",
			"Detector Mode": "Modo del detector",
			"Hot-pixel contouring": "Contorneo de pixeles calientes",
			"Morphology + contour merge + target-specific annotations": "Morfologia + fusion de contornos + anotaciones por objetivo",
			"Spectrogram Intake": "Ingreso de espectrograma",
			"Drop a spectrogram image here or browse from disk. The file is sent to the existing /analyze endpoint as multipart form data and returned as an annotated PNG.": "Suelta una imagen de espectrograma aqui o buscala en disco. El archivo se envia al endpoint /analyze como multipart form-data y vuelve como PNG anotado.",
			"Drag in a spectrogram capture": "Arrastra una captura de espectrograma",
			"PNG and JPEG are the safest formats. The detector decodes the image, isolates hot regions, and overlays target-specific labels on the output figure.": "PNG y JPEG son los formatos mas seguros. El detector decodifica la imagen, aisla regiones calientes y superpone etiquetas especificas por objetivo.",
			"No file selected.": "Ningun archivo seleccionado.",
			"Waiting for input": "Esperando entrada",
			"Local preview appears immediately. Analysis runs only when you submit.": "La vista previa local aparece de inmediato. El analisis se ejecuta solo cuando envias.",
			"Run Detection": "Ejecutar deteccion",
			"Detection Output": "Salida de deteccion",
			"Compare the incoming capture with the generated response. The output image includes the original view, the hot-pixel mask, and the final event overlay from the current backend model.": "Compara la captura de entrada con la respuesta generada. La salida incluye vista original, mascara de pixeles calientes y superposicion final de eventos.",
			"Input Preview": "Vista de entrada",
			"Local image": "Imagen local",
			"Select a spectrogram image to inspect what will be sent to the detector.": "Selecciona una imagen de espectrograma para revisar lo que se enviara al detector.",
			"Annotated Result": "Resultado anotado",
			"API response": "Respuesta del API",
			"Run the detector to render the annotated jamming analysis output.": "Ejecuta el detector para generar la salida anotada del analisis de jamming.",
			"Detection Summary": "Resumen de deteccion",
			"Run ID": "ID de ejecucion",
			"Status": "Estado",
			"Input Dimensions": "Dimensiones de entrada",
			"API Latency": "Latencia del API",
			"Output Size": "Tamano de salida",
			"Last Processed": "Ultimo procesamiento",
			"Session History": "Historial de sesion",
			"No completed analyses yet.": "Aun no hay analisis completados.",
			"Operator Workflow": "Flujo del operador",
			"The interface stays thin on purpose. It is a front end over the Python detection pipeline already in this repository, so the UI shows exactly what the backend is producing.": "La interfaz se mantiene ligera a proposito. Es una capa frontal del pipeline Python de deteccion en este repositorio, mostrando exactamente lo que produce el backend.",
			"Load capture": "Cargar captura",
			"Choose a spectrogram snapshot exported from your data workflow or manual analysis set.": "Elige una instantanea de espectrograma exportada desde tu flujo de datos o conjunto de analisis manual.",
			"Submit to detector": "Enviar al detector",
			"The browser sends the image as multipart form data to the FastAPI /analyze endpoint.": "El navegador envia la imagen como multipart form-data al endpoint /analyze de FastAPI.",
			"Review annotated output": "Revisar salida anotada",
			"Inspect hot-mask behavior, merged detections, and target-specific labels in a single returned PNG.": "Inspecciona el comportamiento de la mascara caliente, detecciones fusionadas y etiquetas especificas en un unico PNG.",
			"Backend Status": "Estado del backend",
			"This panel reflects whether the FastAPI app is reachable from the browser. It checks the existing health endpoint and updates live when the page loads.": "Este panel indica si la app FastAPI es accesible desde el navegador. Comprueba el endpoint de salud y se actualiza al cargar.",
			"Health endpoint": "Endpoint de salud",
			"Response type": "Tipo de respuesta",
			"Successful analysis returns an image/png payload that this UI renders inline.": "Un analisis exitoso devuelve un payload image/png que esta UI renderiza en linea.",
			"Error surface": "Superficie de error",
			"Validation and decode failures are shown directly in the status area.": "Los fallos de validacion y decodificacion se muestran en el area de estado.",
			"Zoom and pan viewer": "Visor de zoom y desplazamiento"
		};

		const STATIC_TEXT_DE = {
			"Terrasat Radar Lab": "Terrasat Radar Lab",
			"Jamming Detection Console": "Jamming-Erkennungs-Konsole",
			"Live Spectrum Intelligence": "Live-Spektrum-Intelligenz",
			"See jamming before it hides in the noise.": "Erkenne Jamming, bevor es im Rauschen verschwindet.",
			"This console turns a raw spectrogram into an operator-ready view of interference activity. Upload a capture, run the detector, and inspect the annotated output generated by the current FastAPI pipeline.": "Diese Konsole wandelt ein Roh-Spektrogramm in eine bedienbare Sicht auf Stoeraktivitaeten um. Lade eine Aufnahme hoch, starte den Detektor und pruefe die annotierte Ausgabe der aktuellen FastAPI-Pipeline.",
			"Open Analyzer": "Analyse oeffnen",
			"Check API Health": "API-Status pruefen",
			"monitored GNSS targets": "ueberwachte GNSS-Ziele",
			"current scan frequency window": "aktuelles Frequenzfenster",
			"annotated figure response": "annotierte Bildantwort",
			"Tracked Bands": "Ueberwachte Baender",
			"Target 01": "Ziel 01",
			"B3I / BDS-II monitoring band": "Ueberwachungsband B3I / BDS-II",
			"Target 02": "Ziel 02",
			"E6 Galileo / L6 QZSS monitoring band": "Ueberwachungsband E6 Galileo / L6 QZSS",
			"Detector Mode": "Detektormodus",
			"Hot-pixel contouring": "Hot-Pixel-Konturierung",
			"Morphology + contour merge + target-specific annotations": "Morphologie + Konturzusammenfuehrung + zielspezifische Annotationen",
			"Spectrogram Intake": "Spektrogramm-Eingang",
			"Drop a spectrogram image here or browse from disk. The file is sent to the existing /analyze endpoint as multipart form data and returned as an annotated PNG.": "Ziehe ein Spektrogramm hierher oder waehle es von der Festplatte. Die Datei wird als multipart form-data an /analyze gesendet und als annotiertes PNG zurueckgegeben.",
			"Drag in a spectrogram capture": "Spektrogramm-Aufnahme hierher ziehen",
			"PNG and JPEG are the safest formats. The detector decodes the image, isolates hot regions, and overlays target-specific labels on the output figure.": "PNG und JPEG sind die sichersten Formate. Der Detektor dekodiert das Bild, isoliert Hot-Regionen und legt zielspezifische Labels ueber die Ausgabe.",
			"No file selected.": "Keine Datei ausgewaehlt.",
			"Waiting for input": "Warte auf Eingabe",
			"Local preview appears immediately. Analysis runs only when you submit.": "Die lokale Vorschau erscheint sofort. Die Analyse startet erst nach dem Senden.",
			"Run Detection": "Erkennung starten",
			"Detection Output": "Erkennungsausgabe",
			"Compare the incoming capture with the generated response. The output image includes the original view, the hot-pixel mask, and the final event overlay from the current backend model.": "Vergleiche die Eingabeaufnahme mit der erzeugten Antwort. Das Ausgabebild enthaelt Originalansicht, Hot-Pixel-Maske und finale Ereignisueberlagerung.",
			"Input Preview": "Eingabevorschau",
			"Local image": "Lokales Bild",
			"Select a spectrogram image to inspect what will be sent to the detector.": "Waehle ein Spektrogramm-Bild, um zu sehen, was an den Detektor gesendet wird.",
			"Annotated Result": "Annotiertes Ergebnis",
			"API response": "API-Antwort",
			"Run the detector to render the annotated jamming analysis output.": "Starte den Detektor, um die annotierte Jamming-Analyse zu erzeugen.",
			"Detection Summary": "Erkennungszusammenfassung",
			"Run ID": "Lauf-ID",
			"Status": "Status",
			"Input Dimensions": "Eingabedimensionen",
			"API Latency": "API-Latenz",
			"Output Size": "Ausgabegroesse",
			"Last Processed": "Zuletzt verarbeitet",
			"Session History": "Sitzungsverlauf",
			"No completed analyses yet.": "Noch keine abgeschlossenen Analysen.",
			"Operator Workflow": "Operator-Ablauf",
			"The interface stays thin on purpose. It is a front end over the Python detection pipeline already in this repository, so the UI shows exactly what the backend is producing.": "Die Oberflaeche bleibt bewusst schlank. Sie ist ein Frontend ueber der Python-Erkennungspipeline in diesem Repository und zeigt genau, was das Backend erzeugt.",
			"Load capture": "Aufnahme laden",
			"Choose a spectrogram snapshot exported from your data workflow or manual analysis set.": "Waehle einen Spektrogramm-Schnappschuss aus deinem Daten-Workflow oder manuellen Analysesatz.",
			"Submit to detector": "An Detektor senden",
			"The browser sends the image as multipart form data to the FastAPI /analyze endpoint.": "Der Browser sendet das Bild als multipart form-data an den FastAPI-Endpunkt /analyze.",
			"Review annotated output": "Annotierte Ausgabe pruefen",
			"Inspect hot-mask behavior, merged detections, and target-specific labels in a single returned PNG.": "Untersuche Hot-Maskenverhalten, zusammengefuehrte Erkennungen und zielspezifische Labels in einem PNG.",
			"Backend Status": "Backend-Status",
			"This panel reflects whether the FastAPI app is reachable from the browser. It checks the existing health endpoint and updates live when the page loads.": "Dieses Panel zeigt, ob die FastAPI-App vom Browser erreichbar ist. Es prueft den Health-Endpunkt und aktualisiert sich beim Laden.",
			"Health endpoint": "Health-Endpunkt",
			"Response type": "Antworttyp",
			"Successful analysis returns an image/png payload that this UI renders inline.": "Eine erfolgreiche Analyse liefert ein image/png-Payload, das diese UI direkt anzeigt.",
			"Error surface": "Fehlerbereich",
			"Validation and decode failures are shown directly in the status area.": "Validierungs- und Dekodierungsfehler werden direkt im Statusbereich angezeigt.",
			"Zoom and pan viewer": "Zoom- und Verschiebe-Ansicht"
		};

		const STATIC_TRANSLATE_EXCLUDE_IDS = new Set([
			"summaryRunId", "summaryStatus", "summaryInputDims", "summaryLatency", "summaryOutputSize", "summaryTimestamp",
			"summaryBandInfo", "healthText", "errorGuide", "themeState", "filename", "statusBadge", "zoomModalTitle"
		]);
		let staticTextNodes = null;

		function normalizeI18nText(value) {
			return (value || "").replace(/\s+/g, " ").trim();
		}

		function t(key) {
			const langTable = translations[currentLanguage] || translations.en;
			return langTable[key] || translations.en[key] || key;
		}

		function collectStaticTextNodes() {
			if (staticTextNodes) {
				return staticTextNodes;
			}

			const selectors = [
				".page-shell h1", ".page-shell h2", ".page-shell h3", ".page-shell p", ".page-shell strong", ".page-shell span", ".page-shell a", ".page-shell button", ".page-shell .label",
				"#zoomModal .zoom-title", "#zoomModal .zoom-btn"
			];

			const nodes = Array.from(document.querySelectorAll(selectors.join(","))).filter((node) => {
				if (!node || !node.textContent) {
					return false;
				}
				if (STATIC_TRANSLATE_EXCLUDE_IDS.has(node.id)) {
					return false;
				}
				if (node.closest("script") || node.classList.contains("workflow-index")) {
					return false;
				}
				return true;
			});

			nodes.forEach((node) => {
				if (!node.dataset.i18nEn) {
					node.dataset.i18nEn = normalizeI18nText(node.textContent);
				}
			});

			staticTextNodes = nodes;
			return staticTextNodes;
		}

		function applyStaticTranslations(lang) {
			const nodes = collectStaticTextNodes();
			const mapByLang = {
				tr: STATIC_TEXT_TR,
				es: STATIC_TEXT_ES,
				de: STATIC_TEXT_DE,
			};
			const selectedMap = mapByLang[lang] || null;
			nodes.forEach((node) => {
				const en = node.dataset.i18nEn || normalizeI18nText(node.textContent);
				if (!en) {
					return;
				}
				if (selectedMap) {
					node.textContent = selectedMap[en] || en;
				} else {
					node.textContent = en;
				}
			});
		}

		function applyLanguage(lang) {
			const allowed = new Set(["en", "tr", "es", "de"]);
			currentLanguage = allowed.has(lang) ? lang : "en";
			applyStaticTranslations(currentLanguage);
			document.documentElement.setAttribute("lang", currentLanguage);
			if (languageSelect) {
				languageSelect.value = currentLanguage;
			}
			if (navAnalyzer) navAnalyzer.textContent = t("navAnalyzer");
			if (navWorkflow) navWorkflow.textContent = t("navWorkflow");
			if (navDocs) navDocs.textContent = t("navDocs");
			if (zoomInputButton) zoomInputButton.textContent = t("zoomPan");
			if (zoomResultButton) zoomResultButton.textContent = t("zoomPan");
			if (inputPreviewTitle) inputPreviewTitle.textContent = t("inputPreview");
			if (resultPreviewTitle) resultPreviewTitle.textContent = t("annotatedResult");
			if (exportButton) exportButton.textContent = t("exportText");
			if (clearHistoryButton) clearHistoryButton.textContent = t("clearText");
			if (zoomModalTitle && !zoomState.source) zoomModalTitle.textContent = t("zoomViewer");
			if (zoomResetButton) zoomResetButton.textContent = t("zoomReset");
			if (zoomCloseButton) zoomCloseButton.textContent = t("zoomClose");
			if (!selectedFile && filename) filename.textContent = t("filenameNone");
			if (!selectedFile) setStatus(t("statusWaiting"), "warn");
			if (!selectedFile) errorGuide.textContent = t("errorGuideDefault");
			try {
				localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
			} catch (error) {
				// Ignore storage failures.
			}
			const activeTheme = document.documentElement.getAttribute("data-theme") || "dark";
			if (themeState) themeState.textContent = t("themeCurrent") + ": " + activeTheme;
			if (themeToggle) {
				themeToggle.textContent = activeTheme === "light" ? t("themeToDark") : t("themeToLight");
			}
		}

		function applyTheme(theme) {
			document.documentElement.setAttribute("data-theme", theme);
			document.body.setAttribute("data-theme", theme);
			if (themeToggle) {
				themeToggle.textContent = theme === "light" ? t("themeToDark") : t("themeToLight");
			}
			if (themeState) {
				themeState.textContent = t("themeCurrent") + ": " + theme;
			}
		}

		function safeGetTheme() {
			try {
				return localStorage.getItem(THEME_STORAGE_KEY);
			} catch (error) {
				return null;
			}
		}

		function safeSetTheme(theme) {
			try {
				localStorage.setItem(THEME_STORAGE_KEY, theme);
			} catch (error) {
				// Ignore storage failures and keep runtime theme only.
			}
		}

		function getInitialLanguage() {
			try {
				const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
				if (saved === "tr" || saved === "en" || saved === "es" || saved === "de") {
					return saved;
				}
			} catch (error) {
				// Ignore storage read failures.
			}
			const browserLang = (navigator.language || "en").toLowerCase();
			if (browserLang.startsWith("tr")) return "tr";
			if (browserLang.startsWith("es")) return "es";
			if (browserLang.startsWith("de")) return "de";
			return "en";
		}

		function applyZoomTransform() {
			zoomImage.style.transform = "translate(calc(-50% + " + zoomState.tx + "px), calc(-50% + " + zoomState.ty + "px)) scale(" + zoomState.scale + ")";
		}

		function openZoomViewer(source) {
			if (!source || !source.src) {
				setStatus(t("statusNoZoomImage"), "warn");
				return;
			}
			zoomState.scale = 1;
			zoomState.tx = 0;
			zoomState.ty = 0;
			zoomState.source = source === inputPreviewImage ? t("inputPreview") : t("annotatedResult");
			zoomModalTitle.textContent = t("zoomViewer") + " - " + zoomState.source;
			zoomImage.src = source.src;
			zoomModal.classList.remove("hidden");
			applyZoomTransform();
		}

		function closeZoomViewer() {
			zoomModal.classList.add("hidden");
			zoomImage.src = "";
			zoomState.dragging = false;
			zoomStage.classList.remove("dragging");
			zoomState.source = "";
		}

		function getInitialTheme() {
			const savedTheme = safeGetTheme();
			if (savedTheme === "dark" || savedTheme === "light") {
				return savedTheme;
			}
			return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
		}

		function formatFileSize(bytes) {
			if (typeof bytes !== "number" || Number.isNaN(bytes)) {
				return "-";
			}
			if (bytes < 1024) {
				return bytes + " B";
			}
			if (bytes < 1024 * 1024) {
				return (bytes / 1024).toFixed(1) + " KB";
			}
			return (bytes / (1024 * 1024)).toFixed(2) + " MB";
		}

		async function getImageDimensions(file) {
			return new Promise((resolve) => {
				const url = URL.createObjectURL(file);
				const img = new Image();
				img.onload = () => {
					resolve({ width: img.naturalWidth, height: img.naturalHeight });
					URL.revokeObjectURL(url);
				};
				img.onerror = () => {
					resolve({ width: null, height: null });
					URL.revokeObjectURL(url);
				};
				img.src = url;
			});
		}

		function updateSummary(meta) {
			if (!meta) {
				summaryRunId.textContent = t("summaryNotStarted");
				summaryStatus.textContent = t("summaryIdle");
				summaryInputDims.textContent = "-";
				summaryLatency.textContent = "-";
				summaryOutputSize.textContent = "-";
				summaryTimestamp.textContent = "-";
				summaryBandInfo.textContent = t("summaryBandInfoDefault");
				return;
			}

			summaryRunId.textContent = t("historyRunPrefix") + " #" + meta.runId;
			summaryStatus.textContent = meta.status;
			summaryInputDims.textContent = meta.inputDimensions || "-";
			summaryLatency.textContent = meta.latencyMs ? meta.latencyMs + " ms" : "-";
			summaryOutputSize.textContent = meta.outputSize || "-";
			summaryTimestamp.textContent = meta.timestamp;
			summaryBandInfo.textContent = t("summaryBandInfoSource") + ": " + meta.fileName + " | " + t("summaryBandInfoEndpoint") + ": /analyze";
		}

		function setStatus(message, tone) {
			statusBadge.textContent = message;
			statusBadge.className = "status";
			if (tone) {
				statusBadge.classList.add(tone);
			}
		}

		function clearResult() {
			if (resultPreviewUrl) {
				URL.revokeObjectURL(resultPreviewUrl);
				resultPreviewUrl = null;
			}
			resultPreviewImage.src = "";
			resultPreviewImage.classList.add("hidden");
			resultPlaceholder.classList.remove("hidden");
		}

		function showResultBlob(blob) {
			clearResult();
			resultPreviewUrl = URL.createObjectURL(blob);
			resultPreviewImage.src = resultPreviewUrl;
			resultPreviewImage.classList.remove("hidden");
			resultPlaceholder.classList.add("hidden");
		}

		function renderHistory() {
			historyList.innerHTML = "";
			if (!sessionHistory.length) {
				historyEmpty.textContent = t("historyEmpty");
				historyList.appendChild(historyEmpty);
				return;
			}

			sessionHistory.forEach((item) => {
				const li = document.createElement("li");
				const button = document.createElement("button");
				button.type = "button";
				button.className = "history-item";
				button.innerHTML = "<strong>" + t("historyRunPrefix") + " #" + item.runId + " - " + item.fileName + "</strong>" +
					"<span>" + item.timestamp + " | " + item.latencyMs + " ms | " + item.outputSize + "</span>";
				button.addEventListener("click", () => {
					showResultBlob(item.resultBlob);
					lastRunMeta = item;
					updateSummary(item);
					setStatus(t("statusHistoryLoaded") + " #" + item.runId, "ok");
				});
				li.appendChild(button);
				historyList.appendChild(li);
			});
		}

		function downloadBlob(fileName, blob) {
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = fileName;
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			URL.revokeObjectURL(url);
		}

		function updateInputPreview(file) {
			if (inputPreviewUrl) {
				URL.revokeObjectURL(inputPreviewUrl);
			}

			inputPreviewUrl = URL.createObjectURL(file);
			inputPreviewImage.src = inputPreviewUrl;
			inputPreviewImage.classList.remove("hidden");

			const emptyState = inputPreviewStage.querySelector(".empty-state");
			if (emptyState) {
				emptyState.classList.add("hidden");
			}
		}

		function selectFile(file) {
			if (!file) {
				return;
			}

			selectedFile = file;
			filename.textContent = file.name + " • " + Math.max(1, Math.round(file.size / 1024)) + " KB";
			setStatus(t("statusReady"), "ok");
			errorGuide.textContent = t("errorGuideDefault");
			clearResult();
			updateInputPreview(file);
			exportButton.disabled = true;
			updateSummary({
				runId: runCounter + 1,
				status: t("summaryStatusReady"),
				inputDimensions: t("summaryReadingImage"),
				latencyMs: null,
				outputSize: "-",
				timestamp: new Date().toLocaleString(),
				fileName: file.name,
			});
		}

		fileInput.addEventListener("change", (event) => {
			selectFile(event.target.files && event.target.files[0]);
		});

		["dragenter", "dragover"].forEach((eventName) => {
			dropzone.addEventListener(eventName, (event) => {
				event.preventDefault();
				dropzone.classList.add("drag-over");
			});
		});

		["dragleave", "drop"].forEach((eventName) => {
			dropzone.addEventListener(eventName, (event) => {
				event.preventDefault();
				dropzone.classList.remove("drag-over");
			});
		});

		dropzone.addEventListener("drop", (event) => {
			const droppedFile = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
			if (droppedFile) {
				fileInput.files = event.dataTransfer.files;
				selectFile(droppedFile);
			}
		});

		analyzeButton.addEventListener("click", async () => {
			if (!selectedFile) {
				setStatus(t("statusChooseFile"), "warn");
				return;
			}

			const formData = new FormData();
			formData.append("file", selectedFile);

			analyzeButton.disabled = true;
			analyzeButton.style.opacity = "0.72";
			setStatus(t("statusRunning"), "warn");
			errorGuide.textContent = t("errorRequestInFlight");
			exportButton.disabled = true;
			const dimensions = await getImageDimensions(selectedFile);
			const startedAt = performance.now();
			const runId = runCounter + 1;

			try {
				const response = await fetch("/analyze", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					let message = t("errorDetectorDefault");
					try {
						const payload = await response.json();
						message = payload.detail || message;
					} catch (error) {
						message = response.status + " " + response.statusText;
					}
					throw new Error(message);
				}

				const blob = await response.blob();
				showResultBlob(blob);
				const latencyMs = Math.round(performance.now() - startedAt);
				runCounter = runId;
				lastRunMeta = {
					runId: runId,
					status: t("summaryStatusCompleted"),
					fileName: selectedFile.name,
					fileSize: selectedFile.size,
					inputDimensions: dimensions.width && dimensions.height ? dimensions.width + " x " + dimensions.height : t("summaryUnknown"),
					latencyMs: latencyMs,
					outputSize: formatFileSize(blob.size),
					timestamp: new Date().toLocaleString(),
					resultBlob: blob,
				};
				sessionHistory.unshift(lastRunMeta);
				if (sessionHistory.length > 10) {
					sessionHistory.length = 10;
				}
				renderHistory();
				updateSummary(lastRunMeta);
				exportButton.disabled = false;
				setStatus(t("statusComplete"), "ok");
				errorGuide.textContent = t("errorApiOkGuide");
			} catch (error) {
				clearResult();
				setStatus(t("statusFailed"), "error");
				errorGuide.textContent = error && error.message ? error.message : t("errorUnknown");
				updateSummary({
					runId: runId,
					status: t("summaryStatusFailed"),
					inputDimensions: dimensions.width && dimensions.height ? dimensions.width + " x " + dimensions.height : t("summaryUnknown"),
					latencyMs: Math.round(performance.now() - startedAt),
					outputSize: "-",
					timestamp: new Date().toLocaleString(),
					fileName: selectedFile.name,
				});
			} finally {
				analyzeButton.disabled = false;
				analyzeButton.style.opacity = "1";
			}
		});

		exportButton.addEventListener("click", () => {
			if (!lastRunMeta || !lastRunMeta.resultBlob) {
				setStatus(t("statusNoRunToExport"), "warn");
				return;
			}

			const baseName = (lastRunMeta.fileName || "jamming_run").replace(/\.[^.]+$/, "");
			const stamp = new Date().toISOString().replace(/[.:]/g, "-");
			downloadBlob(baseName + "_annotated_" + stamp + ".png", lastRunMeta.resultBlob);

			const metadata = {
				runId: lastRunMeta.runId,
				status: lastRunMeta.status,
				endpoint: "/analyze",
				timestamp: lastRunMeta.timestamp,
				latencyMs: lastRunMeta.latencyMs,
				inputFileName: lastRunMeta.fileName,
				inputFileSizeBytes: lastRunMeta.fileSize,
				inputDimensions: lastRunMeta.inputDimensions,
				outputSize: lastRunMeta.outputSize,
				targetBandsMHz: [1268.52, 1278.75],
			};

			downloadBlob(
				baseName + "_metadata_" + stamp + ".json",
				new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" })
			);
			setStatus(t("statusExportDone"), "ok");
		});

		if (zoomInputButton) {
			zoomInputButton.addEventListener("click", () => openZoomViewer(inputPreviewImage));
		}
		if (zoomResultButton) {
			zoomResultButton.addEventListener("click", () => openZoomViewer(resultPreviewImage));
		}
		if (zoomInButton) {
			zoomInButton.addEventListener("click", () => {
				zoomState.scale = Math.min(8, zoomState.scale + 0.2);
				applyZoomTransform();
			});
		}
		if (zoomOutButton) {
			zoomOutButton.addEventListener("click", () => {
				zoomState.scale = Math.max(0.3, zoomState.scale - 0.2);
				applyZoomTransform();
			});
		}
		if (zoomResetButton) {
			zoomResetButton.addEventListener("click", () => {
				zoomState.scale = 1;
				zoomState.tx = 0;
				zoomState.ty = 0;
				applyZoomTransform();
			});
		}
		if (zoomCloseButton) {
			zoomCloseButton.addEventListener("click", closeZoomViewer);
		}

		zoomStage.addEventListener("wheel", (event) => {
			if (zoomModal.classList.contains("hidden")) {
				return;
			}
			event.preventDefault();
			const delta = event.deltaY < 0 ? 0.1 : -0.1;
			zoomState.scale = Math.max(0.3, Math.min(8, zoomState.scale + delta));
			applyZoomTransform();
		}, { passive: false });

		zoomStage.addEventListener("mousedown", (event) => {
			if (zoomModal.classList.contains("hidden")) {
				return;
			}
			zoomState.dragging = true;
			zoomState.startX = event.clientX;
			zoomState.startY = event.clientY;
			zoomStage.classList.add("dragging");
		});

		window.addEventListener("mousemove", (event) => {
			if (!zoomState.dragging) {
				return;
			}
			zoomState.tx += event.clientX - zoomState.startX;
			zoomState.ty += event.clientY - zoomState.startY;
			zoomState.startX = event.clientX;
			zoomState.startY = event.clientY;
			applyZoomTransform();
		});

		window.addEventListener("mouseup", () => {
			if (!zoomState.dragging) {
				return;
			}
			zoomState.dragging = false;
			zoomStage.classList.remove("dragging");
		});

		zoomModal.addEventListener("click", (event) => {
			if (event.target === zoomModal) {
				closeZoomViewer();
			}
		});

		window.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && !zoomModal.classList.contains("hidden")) {
				closeZoomViewer();
			}
		});

		clearHistoryButton.addEventListener("click", () => {
			sessionHistory.length = 0;
			lastRunMeta = null;
			renderHistory();
			exportButton.disabled = true;
			updateSummary(null);
			setStatus(t("statusHistoryCleared"), "warn");
		});

		themeToggle.addEventListener("click", () => {
			const currentTheme = document.documentElement.getAttribute("data-theme") || document.body.getAttribute("data-theme") || "dark";
			const nextTheme = currentTheme === "light" ? "dark" : "light";
			applyTheme(nextTheme);
			safeSetTheme(nextTheme);
		});

		languageSelect.addEventListener("change", () => {
			applyLanguage(languageSelect.value);
		});

		async function checkHealth() {
			try {
				const response = await fetch("/health");
				if (!response.ok) {
					throw new Error(response.status + " " + response.statusText);
				}
				const payload = await response.json();
				if (payload.status !== "ok") {
					throw new Error("Unexpected health response");
				}
				healthText.textContent = t("backendHealthOk");
			} catch (error) {
				healthText.textContent = t("backendHealthFail") + ": " + (error && error.message ? error.message : t("summaryUnknown"));
			}
		}

		checkHealth();
		renderHistory();
		updateSummary(null);
		applyLanguage(getInitialLanguage());
		applyTheme(getInitialTheme());
	</script>
</body>
</html>`;

export default websiteHtml;
