import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import ListKeymap from "@tiptap/extension-list-keymap";
import TextAlign from "@tiptap/extension-text-align";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { SlashCommand } from "@/components/SlashCommand";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { all } from "lowlight";
import CodeBlockComponent from "@/components/CodeBlockComponent";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MathExtension } from "@aarkue/tiptap-math-extension";
import { Extension } from "@tiptap/core";
import { dropCursor } from "@tiptap/pm/dropcursor";
import { gapCursor } from "@tiptap/pm/gapcursor";
import Link from "@tiptap/extension-link";

const lowlight = createLowlight(all);

const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.insertContent("    "); // 4 spaces
      },
    };
  },
}).configure({ lowlight });

const TabExtension = Extension.create({
  name: "tabHandler",

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (editor.isActive("listItem")) {
          editor.commands.sinkListItem("listItem");
          return true;
        }

        if (editor.isActive("codeBlock")) {
          return false; // Let CustomCodeBlock handle it
        }

        editor.commands.insertContent("    "); // 4 spaces for regular text
        return true;
      },

      "Shift-Tab": ({ editor }) => {
        if (editor.isActive("listItem")) {
          editor.commands.liftListItem("listItem");
          return true;
        }
        return false;
      },
    };
  },
});

const AutoPairExtension = Extension.create({
  name: "autoPair",

  addKeyboardShortcuts() {
    const pairs = {
      "{": "}",
      "[": "]",
      "(": ")",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    const shortcuts = {};

    Object.entries(pairs).forEach(([open, close]) => {
      shortcuts[open] = ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { from, to, empty } = selection;

        if (!empty) return false;

        const text = open + close;
        editor.commands.insertContent(text);
        editor.commands.setTextSelection(from + 1);
        return true;
      };
    });

    return shortcuts;
  },
});

export const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
    codeBlock: false,
  }),
  CustomCodeBlock,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
  ListKeymap,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Placeholder.configure({
    placeholder: "Type / for options",
  }),
  Image,
  SlashCommand,
  MathExtension.configure({
    evaluation: true,
    katexOptions: {
      macros: { "\\B": "\\mathbb{B}" },
    },
    delimiters: "dollar",
  }),
  TabExtension,
  AutoPairExtension,
  dropCursor(),
  gapCursor(),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
    validate: href => /^https?:\/\//.test(href),
  }),
];
