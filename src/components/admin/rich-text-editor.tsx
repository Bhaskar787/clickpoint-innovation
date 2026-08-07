"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Node, mergeAttributes } from "@tiptap/core";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Video,
  Link as LinkIcon,
  UploadCloud,
  Loader2,
  X,
  FileCode,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Eye,
  Edit3,
  Minus,
  Info,
} from "lucide-react";

// Custom Tiptap Node Extension for Native HTML5 Video
export const VideoExtension = Node.create({
  name: "video",
  group: "block",
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      class: {
        default: "w-full rounded-md border-0 my-6 shadow-none max-h-[480px] bg-black",
      },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(
        {
          controls: "true",
          class: "w-full rounded-md border-0 my-6 shadow-none max-h-[480px] bg-black",
        },
        HTMLAttributes
      ),
    ];
  },
});

// Custom Tiptap Figcaption Extension
export const Figcaption = Node.create({
  name: "figcaption",
  content: "inline*",
  selectable: false,
  parseHTML() {
    return [{ tag: "figcaption" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "figcaption",
      mergeAttributes(
        { class: "mt-1.5 text-center text-xs italic text-slate-500 dark:text-slate-400 font-medium" },
        HTMLAttributes
      ),
      0,
    ];
  },
});

// Custom Tiptap Figure Extension (Wraps Image + Figcaption)
export const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "image figcaption?",
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      alignment: {
        default: "full-width",
        parseHTML: (element) => {
          if (element.classList.contains("align-left") || element.getAttribute("data-alignment") === "left") return "left";
          if (element.classList.contains("align-right") || element.getAttribute("data-alignment") === "right") return "right";
          return element.getAttribute("data-alignment") || "full-width";
        },
        renderHTML: (attributes) => {
          return {
            "data-alignment": attributes.alignment || "full-width",
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "figure" }];
  },

  renderHTML({ HTMLAttributes }) {
    const alignment = HTMLAttributes.alignment || HTMLAttributes["data-alignment"] || "full-width";
    const alignmentClass =
      alignment === "left"
        ? "align-left"
        : alignment === "right"
        ? "align-right"
        : "full-width";

    const { class: _cls, alignment: _alg, ...rest } = HTMLAttributes;

    return [
      "figure",
      mergeAttributes(rest, {
        class: `my-4 bg-transparent p-0 border-0 ${alignmentClass}`,
        "data-alignment": alignment,
      }),
      0,
    ];
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Write your newspaper story... Select Headings (H1/H2/H3), add photo captions, floated images, pullquotes, or video embeds!",
}: RichTextEditorProps) {
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video" | "caption_figure">("image");
  const [mediaUrlInput, setMediaUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [imageAlignment, setImageAlignment] = useState<"full" | "left" | "right">("full");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: "rounded-xs border-0 shadow-none my-4 max-h-[480px] w-full object-cover",
            },
            align: {
              default: "full",
            },
          };
        },
      }).configure({
        inline: false,
        allowBase64: true,
      }),
      Figure,
      Figcaption,
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "rounded-md overflow-hidden my-6 border-0 shadow-none w-full aspect-video",
        },
      }),
      VideoExtension,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-violet-600 dark:text-violet-400 font-bold underline hover:text-violet-700 transition-colors",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-900 rounded-2xl min-h-[250px]">
        <Loader2 className="h-6 w-6 text-violet-600 animate-spin" />
      </div>
    );
  }

  function handleSetLink() {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    const toastId = toast.loading(`Uploading media to Cloudinary...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        insertMediaContent(data.url);
        toast.success("Inserted media into article!", { id: toastId });
        setMediaModalOpen(false);
      } else {
        toast.error(data.error || "Failed to upload file", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file", { id: toastId });
    } finally {
      setIsUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function insertMediaContent(url: string) {
    const alignClass =
      imageAlignment === "left"
        ? "align-left"
        : imageAlignment === "right"
        ? "align-right"
        : "full-width";

    const alignmentAttr =
      imageAlignment === "left" ? "left" : imageAlignment === "right" ? "right" : "full-width";

    if (captionInput.trim()) {
      const figureHtml = `
        <figure class="my-6 ${alignClass}" data-alignment="${alignmentAttr}">
          <img src="${url}" alt="Photo" class="rounded-xs w-full object-cover max-h-[480px]" />
          <figcaption class="mt-1.5 text-center text-xs italic text-slate-500 dark:text-slate-400 font-medium">${captionInput.trim()}</figcaption>
        </figure>
      `;
      editor?.chain().focus().insertContent(figureHtml).run();
    } else if (mediaType === "video" || url.includes("youtube") || url.includes("youtu.be") || url.endsWith(".mp4")) {
      if (url.includes("youtube") || url.includes("youtu.be")) {
        editor?.chain().focus().setYoutubeVideo({ src: url }).run();
      } else {
        editor?.chain().focus().insertContent({ type: "video", attrs: { src: url } }).run();
      }
    } else {
      const figureHtml = `
        <figure class="my-6 ${alignClass}" data-alignment="${alignmentAttr}">
          <img src="${url}" alt="Photo" class="rounded-xs w-full object-cover max-h-[480px]" />
        </figure>
      `;
      editor?.chain().focus().insertContent(figureHtml).run();
    }
  }

  function handleInsertMediaUrl() {
    if (!mediaUrlInput || !mediaUrlInput.trim()) return;
    insertMediaContent(mediaUrlInput.trim());
    setMediaUrlInput("");
    setCaptionInput("");
    setMediaModalOpen(false);
    toast.success("Media inserted into article!");
  }

  function handleInsertPullquote() {
    const quoteText = window.prompt("Enter Editorial Pullquote text:", "What my eyes saw, my heart couldn't ignore.");
    if (!quoteText) return;
    const html = `<blockquote class="editorial-callout"><p>"${quoteText.trim()}"</p></blockquote>`;
    editor?.chain().focus().insertContent(html).run();
    toast.success("Inserted Newspaper Pullquote Callout!");
  }

  function handleInsertCalloutBox(type: "info" | "warning") {
    const defaultText = type === "info" ? "Key Insight: Navigating the technical landscape with clarity." : "Important Note: Pay close attention to migration guidelines.";
    const text = window.prompt("Enter Callout Alert Box Text:", defaultText);
    if (!text) return;
    const className = type === "info" ? "callout-info" : "callout-warning";
    const icon = type === "info" ? "💡" : "⚠️";
    const html = `<div class="${className}"><p><strong>${icon} Note:</strong> ${text.trim()}</p></div>`;
    editor?.chain().focus().insertContent(html).run();
    toast.success(`Inserted ${type} Callout Box!`);
  }

  function handleInsertHorizontalRule() {
    editor?.chain().focus().setHorizontalRule().run();
    toast.info("Inserted Divider Line!");
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 overflow-hidden flex flex-col shadow-inner transition-colors">
      {/* HEADER MODE SWITCHER (Write vs Live Newspaper Preview) */}
      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-[#131927] border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "write"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Newspaper Editor Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Live Newspaper Preview</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
          Full Article Body Editor System
        </span>
      </div>

      {activeTab === "write" ? (
        <>
          {/* EXPANDED TOOLBAR CONTROLS */}
          <div className="flex flex-wrap items-center gap-1.5 p-3 bg-slate-50 dark:bg-[#131927] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            {/* Heading Level Dropdown Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heading:</span>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                  editor.isActive("heading", { level: 1 }) ? "bg-violet-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
                title="H1 Main Headline (36px Bold)"
              >
                H1
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                  editor.isActive("heading", { level: 2 }) ? "bg-violet-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
                title="H2 Section Heading (28px Bold)"
              >
                H2
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  editor.isActive("heading", { level: 3 }) ? "bg-violet-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
                title="H3 Subheading (22px Bold)"
              >
                H3
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

            {/* Text Formatting */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive("bold") ? "bg-violet-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              title="Bold Text"
            >
              <Bold className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive("italic") ? "bg-violet-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              title="Italic Text"
            >
              <Italic className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive("strike") ? "bg-violet-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive("code") ? "bg-violet-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

            {/* Lists & Callouts */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive("bulletList") ? "bg-violet-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              title="Bullet Points"
            >
              <List className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive("orderedList") ? "bg-violet-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleInsertPullquote}
              className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-amber-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center gap-1 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60"
              title="Insert Editorial Pullquote"
            >
              <Quote className="h-4 w-4" />
              <span>Pullquote</span>
            </button>

            <button
              type="button"
              onClick={() => handleInsertCalloutBox("info")}
              className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-indigo-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60"
              title="Insert Callout Info Alert Box"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Info Box</span>
            </button>

            <button
              type="button"
              onClick={handleInsertHorizontalRule}
              className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              title="Insert Horizontal Divider Line"
            >
              <Minus className="h-4 w-4" />
              <span className="hidden sm:inline">Divider</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

            {/* Link & Newspaper Photo Insertion */}
            <button
              type="button"
              onClick={handleSetLink}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive("link") ? "bg-violet-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
              title="Hyperlink"
            >
              <LinkIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMediaType("caption_figure");
                setMediaModalOpen(true);
              }}
              className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60"
              title="Insert Photo with Caption (Newspaper Style)"
            >
              <ImageIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Photo + Caption</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMediaType("video");
                setMediaModalOpen(true);
              }}
              className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60"
              title="Insert Video Embed"
            >
              <Video className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <span>Video</span>
            </button>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-30 cursor-pointer"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-30 cursor-pointer"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* SELECTED IMAGE / FIGURE INTERACTIVE CONTROL BAR */}
          {(editor.isActive("figure") || editor.isActive("image")) && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-violet-700 text-white text-xs font-bold border-b border-violet-800 shadow-md">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-400" />
                <span>Photo Layout Mode:</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().updateAttributes("figure", { alignment: "left" }).run();
                    toast.success("Set Photo to Float Left (Text on Right)!");
                  }}
                  className={`px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                    editor.getAttributes("figure").alignment === "left"
                      ? "bg-white text-violet-800 border-white shadow-xs font-extrabold"
                      : "bg-violet-800/80 border-violet-500/40 text-white hover:bg-violet-900"
                  }`}
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                  <span>Float Left (Text Right)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().updateAttributes("figure", { alignment: "full-width" }).run();
                    toast.success("Set Photo to Full Width!");
                  }}
                  className={`px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                    !editor.getAttributes("figure").alignment || editor.getAttributes("figure").alignment === "full-width"
                      ? "bg-white text-violet-800 border-white shadow-xs font-extrabold"
                      : "bg-violet-800/80 border-violet-500/40 text-white hover:bg-violet-900"
                  }`}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Full Width</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().updateAttributes("figure", { alignment: "right" }).run();
                    toast.success("Set Photo to Float Right (Text on Left)!");
                  }}
                  className={`px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                    editor.getAttributes("figure").alignment === "right"
                      ? "bg-white text-violet-800 border-white shadow-xs font-extrabold"
                      : "bg-violet-800/80 border-violet-500/40 text-white hover:bg-violet-900"
                  }`}
                >
                  <AlignRight className="h-3.5 w-3.5" />
                  <span>Float Right (Text Left)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().deleteSelection().run();
                    toast.info("Deleted photo!");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-all cursor-pointer ml-2"
                  title="Delete selected photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* EDITOR CANVAS AREA (LIGHT MODE WHITE / DARK MODE NIGHT) */}
          <div className="p-4 sm:p-6 min-h-[450px] bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans leading-relaxed transition-colors">
            <EditorContent
              editor={editor}
              className="prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[400px] [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-violet-600 dark:[&_h3]:text-violet-300 [&_video]:w-full [&_video]:rounded-2xl [&_video]:border [&_video]:border-slate-300 dark:[&_video]:border-slate-700 [&_video]:my-6 [&_video]:shadow-lg [&_iframe]:w-full [&_iframe]:rounded-2xl [&_iframe]:aspect-video [&_iframe]:my-6"
            />
          </div>
        </>
      ) : (
        /* LIVE NEWSPAPER PREVIEW TAB */
        <div className="p-6 bg-slate-100 dark:bg-slate-950 min-h-[500px]">
          <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-violet-600">
              <span>Editorial Newspaper Preview Mode</span>
              <span className="text-slate-400">Clickpoint Times</span>
            </div>

            <div
              className="prose prose-slate max-w-none text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          </div>
        </div>
      )}

      {/* MEDIA & PHOTO CAPTION / VIDEO MODAL */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm">
                {mediaType === "video" ? (
                  <>
                    <Video className="h-4 w-4 text-rose-500" />
                    <span>Insert Video (YouTube, MP4, WebM)</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 text-emerald-500" />
                    <span>Insert Newspaper Photo & Caption</span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo Caption Input (For Photos) */}
              {mediaType !== "video" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Photo Caption Text (Displayed beneath image)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Photo caption text describing the scene..."
                      value={captionInput}
                      onChange={(e) => setCaptionInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  {/* Image Layout Alignment Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Newspaper Photo Layout / Alignment (Text Wrap Side)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setImageAlignment("full")}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          imageAlignment === "full"
                            ? "bg-violet-600 border-violet-500 text-white"
                            : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Full Width</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageAlignment("left")}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          imageAlignment === "left"
                            ? "bg-violet-600 border-violet-500 text-white"
                            : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <AlignLeft className="h-3.5 w-3.5" />
                        <span>Float Left</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageAlignment("right")}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          imageAlignment === "right"
                            ? "bg-violet-600 border-violet-500 text-white"
                            : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <AlignRight className="h-3.5 w-3.5" />
                        <span>Float Right</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Option A: Upload File to Cloudinary */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Option 1: Upload {mediaType === "video" ? "Video (MP4/WebM)" : "Image"} to Cloudinary
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={mediaType === "video" ? "video/*,video/mp4,video/webm" : "image/*"}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingMedia}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                    mediaType === "video"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-violet-600 hover:bg-violet-700"
                  }`}
                >
                  {isUploadingMedia ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>Upload & Embed {mediaType === "video" ? "Video" : "Image"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option B: Enter Media URL */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Option 2: Paste {mediaType === "video" ? "YouTube or Video URL" : "Media / Image URL"}
                </p>
                <input
                  type="text"
                  placeholder={
                    mediaType === "video"
                      ? "https://www.youtube.com/watch?v=... or MP4 URL"
                      : "https://images.unsplash.com/... or Cloudinary URL"
                  }
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                />
                <button
                  type="button"
                  onClick={handleInsertMediaUrl}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Insert {mediaType === "video" ? "Video" : "Photo"} Into Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
