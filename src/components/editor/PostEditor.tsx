import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Extension } from "@tiptap/core";
import { useEffect, useState } from "react";

/* ---------- FontSize Extension ---------- */
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize?.replace("px", ""),
            renderHTML: (attrs) =>
              attrs.fontSize
                ? { style: `font-size:${attrs.fontSize}px` }
                : {},
          },
        },
      },
    ];
  },
});

/* ---------- 색상 테이블 ---------- */
const COLOR_TABLE: string[][] = [
  ["#000000", "#333333", "#666666", "#999999", "#cccccc", "#eeeeee", "#ffffff"],
  ["#ff0000", "#ff4d4d", "#ff9999", "#cc0000", "#990000", "#660000", "#330000"],
  ["#ff7f00", "#ff9f40", "#ffbf80", "#cc6600", "#994d00", "#663300", "#331a00"],
  ["#ffff00", "#ffff66", "#ffff99", "#cccc00", "#999900", "#666600", "#333300"],
  ["#00ff00", "#66ff66", "#99ff99", "#00cc00", "#009900", "#006600", "#003300"],
  ["#0000ff", "#4d4dff", "#9999ff", "#0000cc", "#000099", "#000066", "#000033"],
  ["#8b00ff", "#b266ff", "#d9b3ff", "#6a00cc", "#4b0099", "#2d0066", "#160033"],
];

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function PostEditor({ value, onChange }: Props) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color, FontSize],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  /* 🔥 Edit 페이지에서 value 변경 시 반영 */
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const fontSizes = [
    8, 9, 10, 11, 12,
    14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
  ];

  return (
    <div className="space-y-3">
      {/* 🔥 툴바 */}
      <div className="flex flex-wrap items-center gap-2 bg-[#1c1d22] p-2 rounded border border-gray-700">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>

        {/* 폰트 크기 */}
        <select
          className="bg-gray-800 text-sm px-2 py-1 rounded"
          defaultValue=""
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontSize: e.target.value })
              .run()
          }
        >
          <option value="">글자 크기</option>
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>

        {/* 색상 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker((v) => !v)}
            className="px-2 py-1 bg-gray-800 rounded text-sm"
          >
            색상
          </button>

          {showColorPicker && (
            <div className="absolute left-0 top-full mt-2 bg-[#2a2b30] p-2 rounded shadow-xl z-50 space-y-1">
              {COLOR_TABLE.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((color) => (
                    <button
                      key={color}
                      style={{ backgroundColor: color }}
                      className="w-5 h-5 rounded border border-black/40"
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 에디터 */}
      <div
        className="border border-gray-700 rounded p-3 bg-[#1c1d22] min-h-[220px]"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
