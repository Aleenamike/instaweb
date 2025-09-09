import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { ChromePicker } from "react-color";
import "./App.css";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Code editor states
  const [isCodeEditable, setIsCodeEditable] = useState(false);
  const [editedHtml, setEditedHtml] = useState("");
  
  // Customization states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [customFontInput, setCustomFontInput] = useState("");
  const [customizations, setCustomizations] = useState({
    primaryColor: "#3B82F6",
    fontFamily: "Inter",
    textContent: {},
    darkMode: false,
    compactLayout: false,
    headerBg: "",
    footerBg: ""
  });
  const [showHeaderPicker, setShowHeaderPicker] = useState(false);
  const [showFooterPicker, setShowFooterPicker] = useState(false);
  
  // Download states
  const [downloading, setDownloading] = useState(false);
  const [inlineEditing, setInlineEditing] = useState(false);
  const [projectCardCount, setProjectCardCount] = useState(3);
  const [previewVersion, setPreviewVersion] = useState(0);

  const bumpPreview = () => setPreviewVersion((v) => v + 1);
  
  const iframeRef = useRef(null);
  
  const themePickerRef = useRef(null);

  // Google Fonts list
  const googleFonts = [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", 
    "Source Sans Pro", "Raleway", "PT Sans", "Nunito", "Ubuntu", "Playfair Display"
  ];

  // Update edited HTML when original HTML changes
  useEffect(() => {
    if (html && !editedHtml) {
      setEditedHtml(html);
    }
  }, [html, editedHtml]);

  // Apply customizations to HTML
  const applyCustomizations = (htmlContent) => {
    let modifiedHtml = htmlContent;
    
    // Apply color changes with broader matches and persistent override block
    if (customizations.primaryColor) {
      modifiedHtml = modifiedHtml
        .replace(/#3B82F6|#2563EB|#1D4ED8|#60A5FA|#93C5FD/gi, customizations.primaryColor)
        .replace(/rgb\(59,\s*130,\s*246\)/gi, customizations.primaryColor);

      const overrides = `\n<style id="custom-overrides">\n  :root{ --accent:${customizations.primaryColor}; }\n  a, .link { color: var(--accent) !important; }\n  .btn, button, .cta { background-color: var(--accent) !important; border-color: var(--accent) !important; color: #ffffff !important; }\n  .badge, .pill { background-color: var(--accent) !important; }\n  .accent-border { border-color: var(--accent) !important; }\n</style>`;
      if (modifiedHtml.includes('id="custom-overrides"')) {
        modifiedHtml = modifiedHtml.replace(/<style id=\"custom-overrides\">[\s\S]*?<\/style>/, overrides);
      } else {
        modifiedHtml = modifiedHtml.replace('<head>', `<head>${overrides}`);
      }
    }
    
    // Font handling
    if (isCodeEditable) {
      // Respect manual font changes in edited code. Only ensure Google Font import exists for detected family.
      const manualFontMatch = modifiedHtml.match(/font-family:\s*['\"]?([A-Za-z0-9\s-]+)['\"]?\s*,/i);
      const manualFamily = manualFontMatch ? manualFontMatch[1].trim() : '';
      if (manualFamily && !modifiedHtml.includes('fonts.googleapis.com')) {
        modifiedHtml = modifiedHtml.replace(
          '<head>',
          `<head>\n  <link href="https://fonts.googleapis.com/css2?family=${manualFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">`
        );
      }
    } else if (customizations.fontFamily) {
      // Apply selected font when not in code editing mode
      modifiedHtml = modifiedHtml.replace(
        /font-family:\s*[^;]+/g,
        `font-family: '${customizations.fontFamily}', sans-serif`
      );
      if (!modifiedHtml.includes('fonts.googleapis.com')) {
        modifiedHtml = modifiedHtml.replace(
          '<head>',
          `<head>\n  <link href="https://fonts.googleapis.com/css2?family=${customizations.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">`
        );
      }
    }

    // Header/Footer color overrides
    const headerBg = customizations.headerBg && customizations.headerBg.trim();
    const footerBg = customizations.footerBg && customizations.footerBg.trim();
    if (headerBg || footerBg) {
      const hfCss = `\n<style id="custom-header-footer-overrides">\n  ${headerBg ? `header, .site-header, .navbar, .topbar, .app-header { background-color: ${headerBg} !important; }` : ""}\n  ${footerBg ? `footer, .site-footer, .app-footer { background-color: ${footerBg} !important; }` : ""}\n</style>`;
      if (modifiedHtml.includes('id="custom-header-footer-overrides"')) {
        modifiedHtml = modifiedHtml.replace(/<style id=\"custom-header-footer-overrides\">[\s\S]*?<\/style>/, hfCss);
      } else {
        modifiedHtml = modifiedHtml.replace('<head>', `<head>${hfCss}`);
      }
    } else {
      modifiedHtml = modifiedHtml.replace(/<style id=\"custom-header-footer-overrides\">[\s\S]*?<\/style>/, '');
    }

    // Dark mode overrides
    if (customizations.darkMode) {
      const darkCss = `\n<style id="custom-dark-overrides">\n  body { background-color: #0f172a !important; color: #e5e7eb !important; }\n  header, footer, section, main, .card, .panel { background-color: #111827 !important; color: #e5e7eb !important; }\n  hr, .divider { border-color: #374151 !important; }\n  input, textarea, select { background-color: #1f2937 !important; color: #e5e7eb !important; border-color: #374151 !important; }\n</style>`;
      if (modifiedHtml.includes('id="custom-dark-overrides"')) {
        modifiedHtml = modifiedHtml.replace(/<style id=\"custom-dark-overrides\">[\s\S]*?<\/style>/, darkCss);
      } else {
        modifiedHtml = modifiedHtml.replace('<head>', `<head>${darkCss}`);
      }
    } else {
      modifiedHtml = modifiedHtml.replace(/<style id=\"custom-dark-overrides\">[\s\S]*?<\/style>/, '');
    }

    // Compact layout overrides
    if (customizations.compactLayout) {
      const compactCss = `\n<style id="custom-compact-overrides">\n  :root { --space: 0.75rem; }\n  body { line-height: 1.4; }\n  section, .section, .container { padding-top: var(--space) !important; padding-bottom: var(--space) !important; }\n  h1 { margin-bottom: 0.5rem !important; }\n  h2, h3, h4 { margin-top: 0.75rem !important; margin-bottom: 0.5rem !important; }\n  p { margin-bottom: 0.5rem !important; }\n  .grid { gap: 0.75rem !important; }\n  .btn, button, .cta { padding: 0.5rem 0.875rem !important; }\n</style>`;
      if (modifiedHtml.includes('id="custom-compact-overrides"')) {
        modifiedHtml = modifiedHtml.replace(/<style id=\"custom-compact-overrides\">[\s\S]*?<\/style>/, compactCss);
      } else {
        modifiedHtml = modifiedHtml.replace('<head>', `<head>${compactCss}`);
      }
    } else {
      modifiedHtml = modifiedHtml.replace(/<style id=\"custom-compact-overrides\">[\s\S]*?<\/style>/, '');
    }
    
    return modifiedHtml;
  };

  // Re-apply DOM-based adjustments when controls change
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    try {
      const selectors = [
        ".project-card",
        ".card",
        ".project",
        "section .grid > div",
        "main .grid > div"
      ];
      let list = null;
      for (const sel of selectors) {
        const nodes = Array.from(doc.querySelectorAll(sel));
        if (nodes.length >= 1) {
          list = nodes;
          break;
        }
      }
      if (list && list.length >= 1) {
        const first = list[0];
        const parent = first.parentElement;
        if (parent && projectCardCount > 0) {
          const current = Array.from(parent.children);
          current.forEach((el) => {
            if (el !== first) el.remove();
          });
          for (let i = 1; i < projectCardCount; i++) {
            const clone = first.cloneNode(true);
            parent.appendChild(clone);
          }
        }
      }
    } catch (_) {}

    try {
      if (inlineEditing) {
        doc.body.contentEditable = "true";
        doc.body.style.outline = "2px dashed #93c5fd";
      } else {
        doc.body.contentEditable = "false";
        doc.body.style.outline = "";
      }
    } catch (_) {}
  }, [projectCardCount, inlineEditing, html, editedHtml]);

  

  // Sync selected font from code when user saves or HTML changes
  useEffect(() => {
    const baseHtml = isCodeEditable ? editedHtml : html;
    if (!baseHtml) return;
    const match = baseHtml.match(/font-family:\s*['\"]?([A-Za-z0-9\s-]+)['\"]?\s*,/i);
    if (match && match[1]) {
      const family = match[1].trim();
      setSelectedFont(family);
      setCustomizations(prev => ({ ...prev, fontFamily: family }));
    }
  }, [html, editedHtml]);

  // Close theme color popover on outside click
  useEffect(() => {
    if (!showColorPicker) return;
    const handleClickAway = (e) => {
      if (themePickerRef.current && !themePickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, [showColorPicker]);

  // Get current HTML (either edited or original with customizations)
  const getCurrentHtml = () => {
    const baseHtml = isCodeEditable ? editedHtml : html;
    return applyCustomizations(baseHtml);
  };

  // When iframe loads, optionally enable inline editing and apply layout tweaks
  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Adjust layout: attempt to set number of project cards for common selectors
    try {
      const selectors = [
        ".project-card",
        ".card",
        ".project",
        "section .grid > div",
        "main .grid > div"
      ];
      let list = null;
      for (const sel of selectors) {
        const nodes = Array.from(doc.querySelectorAll(sel));
        if (nodes.length >= 1) {
          list = nodes;
          break;
        }
      }
      if (list && list.length >= 1) {
        const first = list[0];
        const parent = first.parentElement;
        if (parent && projectCardCount > 0) {
          // Remove current siblings of same type
          const current = Array.from(parent.children);
          current.forEach((el) => {
            // keep none; we'll rebuild up to desired count using the first as template
            if (el !== first) el.remove();
          });
          // Re-add clones to match desired count
          for (let i = 1; i < projectCardCount; i++) {
            const clone = first.cloneNode(true);
            parent.appendChild(clone);
          }
        }
      }
    } catch (_) {}

    // Enable inline editing inside preview
    if (inlineEditing) {
      try {
        doc.body.contentEditable = "true";
        doc.body.style.outline = "2px dashed #93c5fd";
        const updateFromIframe = () => {
          const serialized = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
          setEditedHtml(serialized);
          setIsCodeEditable(true);
        };
        doc.addEventListener("input", updateFromIframe, { passive: true });
        doc.addEventListener("blur", updateFromIframe, { capture: true, passive: true });
      } catch (_) {}
    }

    // Prevent full-page navigation from links inside the preview
    try {
      doc.addEventListener(
        "click",
        (e) => {
          const anchor = e.target.closest && e.target.closest("a[href]");
          if (!anchor) return;
          const href = anchor.getAttribute("href") || "";
          // Allow same-page hash navigation within iframe
          if (href.startsWith("#")) {
            const id = href.slice(1);
            const el = id ? doc.getElementById(id) : null;
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
          }
          // Block navigating the parent app for relative links
          if (/^(\/|\.\/|\.\.\/)/.test(href) || !/^https?:/i.test(href)) {
            e.preventDefault();
          }
        },
        { capture: true }
      );
    } catch (_) {}
  };

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/generate", { prompt });
      setHtml(res.data.html || "");
      setEditedHtml(""); // Reset edited HTML
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.error || e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentHtml());
      alert("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy code:", err);
      alert("Failed to copy code to clipboard");
    }
  };

  const toggleCodeEdit = () => {
    if (!isCodeEditable) {
      setEditedHtml(getCurrentHtml());
    }
    setIsCodeEditable(!isCodeEditable);
  };

  const saveCodeChanges = () => {
    setHtml(editedHtml);
    setIsCodeEditable(false);
    bumpPreview();
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    setCustomizations(prev => ({
      ...prev,
      primaryColor: color.hex
    }));
    bumpPreview();
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    setCustomizations(prev => ({
      ...prev,
      fontFamily: font
    }));
    bumpPreview();
  };

  const handleHeaderColor = (color) => {
    setCustomizations(prev => ({ ...prev, headerBg: color.hex }));
    bumpPreview();
  };

  const handleFooterColor = (color) => {
    setCustomizations(prev => ({ ...prev, footerBg: color.hex }));
    bumpPreview();
  };

  const downloadAsZip = async () => {
    if (!html) {
      alert("No website to download. Please generate a website first.");
      return;
    }

    setDownloading(true);
    try {
      const response = await axios.post("/download-zip", {
        html: getCurrentHtml(),
        filename: "generated-website"
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated-website.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download website");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Website Generator</h1>
          <p className="text-gray-600">Type what you want, get a static site instantly.</p>
        </header>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your website
          </label>
          <textarea
            rows={4}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Example: A modern portfolio with a hero section, about me, three project cards, and a contact footer."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="mt-3 flex gap-3">
            <button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400"
            >
              {loading ? "Generating..." : "Generate Website"}
            </button>
            {error && <div className="text-red-600 text-sm self-center">{error}</div>}
          </div>
        </div>

        {html && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Preview */}
              <div className="bg-white rounded-xl shadow">
                <div className="px-4 py-2 border-b font-semibold flex justify-between items-center">
                  <span>Live Preview</span>
                  <div className="text-sm text-gray-500">
                    {isCodeEditable ? "Showing edited version" : "Showing generated version"}
                  </div>
                </div>
                <iframe
                  title="preview"
                  className="w-full h-[500px] border-0"
                  ref={iframeRef}
                  onLoad={handleIframeLoad}
                  key={previewVersion}
                  srcDoc={getCurrentHtml()}
                />
              </div>

              {/* Code Preview/Editor Panel */}
              <div className="bg-white rounded-xl shadow">
                <div className="px-4 py-2 border-b font-semibold flex justify-between items-center">
                  <span>Code {isCodeEditable ? "Editor" : "Preview"}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={copyCode}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Copy Code
                    </button>
                    <button
                      onClick={toggleCodeEdit}
                      className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded"
                    >
                      {isCodeEditable ? "Back to Read-Only" : "Edit Code"}
                    </button>
                    {isCodeEditable && (
                      <button
                        onClick={saveCodeChanges}
                        className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 rounded"
                      >
                        Save & Update Preview
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-[400px]">
                  {isCodeEditable ? (
                    <Editor
                      height="100%"
                      defaultLanguage="html"
                      value={editedHtml}
                      onChange={(value) => setEditedHtml(value || "")}
                      theme="vs-light"
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        wordWrap: "on"
                      }}
                    />
                  ) : (
                    <pre className="p-4 h-full overflow-auto text-sm bg-gray-50">
                      <code>{getCurrentHtml()}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>

            {/* Customization Panel */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-semibold mb-4">Customization Panel</h3>

                {/* 1) Header/Footer Colors */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header & Footer Colors</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="text-xs text-gray-600 mb-1">Header background</div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border cursor-pointer"
                          style={{ backgroundColor: customizations.headerBg || "#111827" }}
                          onClick={() => setShowHeaderPicker(!showHeaderPicker)}
                        />
                        <span className="text-xs text-gray-600">{customizations.headerBg || "#111827"}</span>
                      </div>
                      {showHeaderPicker && (
                        <div className="absolute z-20 mt-2 shadow-lg bg-white border rounded" style={{ width: 240 }} onMouseLeave={() => setShowHeaderPicker(false)}>
                          <ChromePicker color={customizations.headerBg || "#111827"} onChange={handleHeaderColor} disableAlpha />
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <div className="text-xs text-gray-600 mb-1">Footer background</div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border cursor-pointer"
                          style={{ backgroundColor: customizations.footerBg || "#111827" }}
                          onClick={() => setShowFooterPicker(!showFooterPicker)}
                        />
                        <span className="text-xs text-gray-600">{customizations.footerBg || "#111827"}</span>
                      </div>
                      {showFooterPicker && (
                        <div className="absolute z-20 mt-2 shadow-lg bg-white border rounded" style={{ width: 240 }} onMouseLeave={() => setShowFooterPicker(false)}>
                          <ChromePicker color={customizations.footerBg || "#111827"} onChange={handleFooterColor} disableAlpha />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2) Theme Color */}
                <div className="mb-6" ref={themePickerRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border cursor-pointer" style={{ backgroundColor: selectedColor }} onClick={() => setShowColorPicker(!showColorPicker)} />
                    <span className="text-sm text-gray-600">{selectedColor}</span>
                  </div>
                  {showColorPicker && (
                    <div className="mt-2 relative">
                      <div className="absolute z-20 mt-1 shadow-lg bg-white border rounded" style={{ width: 240 }} onMouseLeave={() => setShowColorPicker(false)}>
                        <ChromePicker color={selectedColor} onChange={handleColorChange} />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3) Font Family & Custom Font */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    value={selectedFont}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {googleFonts.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                  </select>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Or enter a custom Google Font (e.g., Jost)"
                      value={customFontInput}
                      onChange={(e) => setCustomFontInput(e.target.value)}
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const name = customFontInput.trim();
                        if (!name) return;
                        setSelectedFont(name);
                        setCustomizations(prev => ({ ...prev, fontFamily: name }));
                        bumpPreview();
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* 4) Compact + 5) Dark Mode */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Layout Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" checked={customizations.compactLayout} onChange={(e) => setCustomizations(prev => ({ ...prev, compactLayout: e.target.checked }))} />
                      <span className="text-sm">Compact Layout</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" checked={customizations.darkMode} onChange={(e) => setCustomizations(prev => ({ ...prev, darkMode: e.target.checked }))} />
                      <span className="text-sm">Dark Mode</span>
                    </label>
                  </div>
                </div>

                {/* 6) Project cards */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project cards</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={projectCardCount}
                      onChange={(e) => setProjectCardCount(parseInt(e.target.value || "1", 10))}
                      className="w-24 p-2 border rounded"
                    />
                    <span className="text-xs text-gray-500">Clones common card/grid items for quick preview</span>
                  </div>
                </div>

                {/* 7) Inline Text Editing */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Editing</label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" checked={inlineEditing} onChange={(e) => setInlineEditing(e.target.checked)} />
                    <span className="text-sm">Enable inline editing in preview</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Click any text in the preview to edit it directly.</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
      {/* Bottom-centered Download section */}
      {html && (
        <div className="py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center">
              <button
                onClick={downloadAsZip}
                disabled={downloading || !html}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {downloading ? "Creating ZIP..." : "Download Project (ZIP)"}
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">Exports a VS Code-ready project with separate HTML, CSS, and JS</p>
          </div>
        </div>
      )}
    </div>
  );
}