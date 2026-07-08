"use client";

import React from "react";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { BasicNodesKit } from "@/components/editor/plugins/basic-nodes-kit";
import { ToolbarButton, ToolbarGroup } from "@/components/ui/toolbar";
import {
  BoldIcon,
  HeadingIcon,
  ItalicIcon,
  QuoteIcon,
  UnderlineIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
} from "@/components/ui/list-toolbar-button";
import { ListKit } from "@/components/editor/plugins/list-kit";
import { AlignToolbarButton } from "@/components/ui/align-toolbar-button";
import { AlignKit } from "@/components/editor/plugins/align-kit";
import { EmojiKit } from "@/components/editor/plugins/emoji-kit";
import { EmojiToolbarButton } from "@/components/ui/emoji-toolbar-button";
import { cn } from "@/lib/utils";
function normalizeInitialValue(initialValue?: string | Value): Value {
  if (!initialValue) {
    return [
      {
        type: "p",
        children: [{ text: "" }],
      },
    ];
  }

  if (typeof initialValue !== "string") {
    if (!Array.isArray(initialValue)) {
      return [
        {
          type: "p",
          children: [{ text: "" }],
        },
      ];
    }

    return initialValue;
  }

  try {
    const parsed = JSON.parse(initialValue);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.error("Invalid Plate JSON:", e);
  }

  // fallback
  return [
    {
      type: "p",
      children: [{ text: initialValue }],
    },
  ];
}

interface ListingEditorProps {
  initialValue?: string | Value;
  readOnly?: boolean;
  onChange?: (value: Value) => void;
  placeholder?: string;
}

export default function ListingEditor({
  initialValue,
  readOnly,
  onChange,
  placeholder,
}: ListingEditorProps) {
  const editor = usePlateEditor({
    plugins: [...BasicNodesKit, ...ListKit, ...AlignKit, ...EmojiKit], //[BoldPlugin, ItalicPlugin, UnderlinePlugin], // Add the mark plugins
    value: normalizeInitialValue(initialValue), // Set initial content
    readOnly,
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        if (onChange) {
          onChange(value as Value);
        }
      }}
    >
      {!readOnly && (
        <FixedToolbar className="justify-start rounded-t-2xl border border-b-0">
          <ToolbarButton onClick={() => editor.tf.h3.toggle()}>
            <HeadingIcon />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>
            <QuoteIcon />
          </ToolbarButton>

          <ToolbarGroup>
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.underline}
              tooltip="Underline (⌘+U)"
            >
              <UnderlineIcon />
            </MarkToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <AlignToolbarButton />

            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            {/* <ToggleToolbarButton /> */}
          </ToolbarGroup>
          <ToolbarGroup>
            <EmojiToolbarButton />
          </ToolbarGroup>
        </FixedToolbar>
      )}
      <EditorContainer
        className={cn(
          "bg-input/50 rounded-2xl border shadow-md",
          !readOnly && "rounded-t-none",
        )}
      >
        <Editor
          placeholder={placeholder ?? "Type your amazing content here..."}
          // variant={"fullWidth"}
          className="px-8 sm:px-12 data-readonly:select-none cursor-default"
        />
      </EditorContainer>
    </Plate>
  );
}
