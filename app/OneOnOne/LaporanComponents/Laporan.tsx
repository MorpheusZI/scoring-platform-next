import React, { useState, useEffect } from "react";
//TipTap imports
import { useEditor, Editor, EditorContent, Content, NodePos } from '@tiptap/react';
import { Underline as lineUnder } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import { Node } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder';

//Component Imports
import ToolBar from "../../Rcomponents/Toolbar";
import { testingdata } from '../Server/ambilData'

//Shadcn / Lucide imports
import { Minus, Plus, Ellipsis, Check, Smile, Frown, Angry } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from "@/components/ui/button";

type Data = {
  Judul: string,
  Isi: string
}

export default function Laporan() {
  const [editors, setEditors] = useState<Array<Editor | null>>([]);
  const [activeEditorIndex, setActiveEditorIndex] = useState(0);
  const [hoveredEditorIndex, setHoveredEditorIndex] = useState<number | null>(null);


  useEffect(() => {
    setEditors([createEditor()]);
  }, []);
  const createEditor = () => {
    const editor = new Editor({
      extensions: [
        StarterKit.configure({
          blockquote: {
            HTMLAttributes: {
              class: "ml-3 px-6 border-l-2 border-gray-400"
            }
          },
          bulletList: {
            HTMLAttributes: {
              class: "mx-6 px-2 list-disc list-outside "
            }
          }, orderedList: {
            HTMLAttributes: {
              class: "mx-7 list-decimal list-outside "
            }
          },
          heading: {
            levels: [1, 2, 3],
            HTMLAttributes: {
              class: 'text-4xl'
            }
          },
        }),
        lineUnder,
        Placeholder.configure({
          placeholder: "Deskripsikan bagamaina situasi,cara anda melakukan dan hasilnya...",
          emptyEditorClass: "first:before:h-0 first:before:text-gray-400 first:before:content-[attr(data-placeholder)] first:before:float-left"
        })
      ],
      editorProps: {
        attributes: {
          class: "flex w-full px-3 py-4 text-black outline-none",
        }
      }
    });
    return editor
  };

  const addEditor = () => {
    const newEditors = [...editors, createEditor()];
    setEditors(newEditors);
  };

  const removeEditor = (index: number) => {
    const updatedEditors = editors.filter((editor, idx) => idx !== index);
    setEditors(updatedEditors);
  };

  const handleEditorChange = (index: number, editor: Editor) => {
    const updatedEditors = [...editors];
    updatedEditors[index] = editor;
    setActiveEditorIndex(index)
    setEditors(updatedEditors);
  };

  const handleToolbarClick = (command: any) => {
    const activeEditor = editors[activeEditorIndex];
    if (activeEditor) {
      switch (command) {
        case 'toggleBold':
          activeEditor.chain().focus().toggleBold().run()
          break;

        case 'toggleItalic':
          activeEditor.chain().focus().toggleItalic().run()
          break;

        case 'toggleStrike':
          activeEditor.chain().focus().toggleStrike().run()
          break;

        case 'toggleUnderline':
          activeEditor.chain().focus().toggleUnderline().run()
          break;

        case 'toggleBlockquote':
          activeEditor.chain().focus().toggleBlockquote().run()
          break;

        case 'toggleOrderedList':
          activeEditor.chain().focus().toggleOrderedList().run()
          break;

        case 'toggleBulletList':
          activeEditor.chain().focus().toggleBulletList().run()
          break;

        case 'Sink':
          activeEditor.chain().focus().sinkListItem('listItem').run()
          break;


        default:
          break;
      }
    }
  };


  return (
    <div id="LaporanWrap" className="h-fit">
      <ToolBar onToolbarClick={handleToolbarClick} editor={editors[activeEditorIndex]} />
      <div className="editor-container">
        <div className="flex flex-col gap-6 px-7 py-6">
          <h1 className="text-2xl">Laporan </h1>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Ceritakan bagaimana berjalannya komitmenmu dalam 2 minggu terakhir.</h1>
            <div className="flex flex-col gap-2">
              {editors.map((editor, index) => {
                if (editor) {
                  return (
                    <div key={index} className="relative flex flex-col py-5"
                      onMouseEnter={() => setHoveredEditorIndex(index)}
                      onMouseLeave={() => setHoveredEditorIndex(null)}
                    >
                      <div className="flex px-4 gap-2">
                        <input type="checkbox" className="w-4" />
                        <input type="text" className="flex w-full text-black font-bold outline-none" placeholder="Komitmen anda..." />
                      </div>
                      <EditorContent
                        editor={editor}
                        className="w-full px-1"
                        onChange={(content: Content) => handleEditorChange(index, editor)}
                        onFocus={() => {
                          setHoveredEditorIndex(index)
                          setActiveEditorIndex(index)
                        }}
                      />
                      <div className="absolute right-[10px] top-2">
                        <DropdownMenu >
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" ><Ellipsis /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => addEditor()}>
                                Tambah Komitmen
                                <DropdownMenuShortcut><Plus /></DropdownMenuShortcut>
                              </DropdownMenuItem>
                              {index !== 0 &&
                                <DropdownMenuItem onClick={() => removeEditor(index)}>
                                  Delete Komitmen
                                  <DropdownMenuShortcut><Minus /></DropdownMenuShortcut>
                                </DropdownMenuItem>
                              }
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                }
                else {
                  return null;
                }
              })}
            </div>
          </div>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Bagaimana perasaan kamu 2 minggu terakhir?</h1>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-xl hover:cursor-pointer">
                <Smile className="w-10 h-10" />
                <p className="text-lg">Senang</p>
              </div>
              <div className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-xl hover:cursor-pointer">
                <Frown className="w-10 h-10" />
                <p className="text-lg">Sedih</p>
              </div>
              <div className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-xl hover:cursor-pointer">
                <Angry className="w-10 h-10" />
                <p className="text-lg">Marah</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

