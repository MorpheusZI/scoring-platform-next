import React, { useState, useEffect } from "react"
// tipTap imports
import { useEditor, Editor, EditorContent } from '@tiptap/react';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

//tiptap Collaboration
import { Collaboration } from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'

//component imports
import ToolBar from "../../Rcomponents/Toolbar";

// lucide/shadcn imports
import { Minus, Plus, Ellipsis, Smile, Frown, Angry, Sparkles } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from "@/components/ui/button";

type LaporanProps = {
  handleKomitmenDatatoAI: (KomitmenDataArr: KomitmenData[]) => void
}

type KomitmenData = {
  Judul: string;
  Isi: string;
};

type ContentThing = {
  content: string
}
type TitleThing = {
  Title: string
}
type KomitmenEditors = {
  TitleEditor: Editor,
  ContentEditor: Editor,
}

export default function Laporan({ handleKomitmenDatatoAI }: LaporanProps) {
  const [editors, setEditors] = useState<Array<KomitmenEditors | null>>([]);
  const [activeEditorIndex, setActiveEditorIndex] = useState(0);
  const [hoveredEditorIndex, setHoveredEditorIndex] = useState<number | null>(null);
  const [DataArr, setDataArr] = useState<Array<KomitmenData>>([]);
  const [contentthing, setContething] = useState<ContentThing>()
  const [TitleThing, setTitleThing] = useState<TitleThing>()

  useEffect(() => {
    setEditors([{
      TitleEditor: createTitleEditor(),
      ContentEditor: createEditor(),
    }]);
    const newData = [{ Judul: "", Isi: "" }]
    setDataArr(newData)
  }, []);

  const addJudulToDataArr = (judul: string) => {
    if (DataArr[activeEditorIndex]) {
      DataArr[activeEditorIndex].Judul = judul
    }
  }

  const addIsiToDataArr = (isi: string) => {
    if (DataArr[activeEditorIndex]) {
      DataArr[activeEditorIndex].Isi = isi
    }
  }

  useEffect(() => {
    const Isidata = contentthing?.content
    addIsiToDataArr(Isidata ? Isidata : '')
  }, [contentthing])

  useEffect(() => {
    const Juduldata = TitleThing?.Title
    addJudulToDataArr(Juduldata ? Juduldata : '')
  }, [TitleThing])



  const createTitleEditor = () => {
    const ydoc = new Y.Doc()
    const provider = new TiptapCollabProvider({
      name: `KomitmenTitleDoc${editors.length}`,
      appId: '7mezzgmy',
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTE0NDAwMTYsIm5iZiI6MTcxMTQ0MDAxNiwiZXhwIjoxNzExNTI2NDE2LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiI3bWV6emdteSJ9.4C8uIXaK-yGVcRJYpnpTtdxBpYBJfugaiaM692Qsor8',
      document: ydoc
    })
    const Titleeditor = new Editor({
      onUpdate: ({ editor }) => {
        setTitleThing({ Title: editor.getText() })
      },
      extensions: [
        StarterKit,
        Underline,
        Placeholder.configure({
          placeholder: "KomitmenAnda",
          emptyEditorClass: "first:before:h-0 first:before:text-gray-400 first:before:content-[attr(data-placeholder)] first:before:float-left"
        }),
        Collaboration.configure({
          document: ydoc
        })
      ],
      editorProps: {
        attributes: {
          class: "w-full px-3 py-4 text-black outline-none",
        }
      },
    });
    return Titleeditor;
  }

  const createEditor = () => {
    const ydoc = new Y.Doc()
    const provider = new TiptapCollabProvider({
      name: `KomitmenContentDoc${editors.length}`,
      appId: '7mezzgmy',
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTE0NDAwMTYsIm5iZiI6MTcxMTQ0MDAxNiwiZXhwIjoxNzExNTI2NDE2LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiI3bWV6emdteSJ9.4C8uIXaK-yGVcRJYpnpTtdxBpYBJfugaiaM692Qsor8',
      document: ydoc
    })
    const editor = new Editor({
      onUpdate: ({ editor }) => {
        setContething({ content: editor.getText() })
      },
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

        }),
        Underline,
        Placeholder.configure({
          placeholder: "Deskripsikan bagamaina situasi,cara anda melakukan dan hasilnya...",
          emptyEditorClass: "first:before:h-0 first:before:text-gray-400 first:before:content-[attr(data-placeholder)] first:before:float-left"
        }),
        Collaboration.configure({
          document: ydoc
        })
      ],
      editorProps: {
        attributes: {
          class: "w-full px-3 py-4 text-black outline-none",
        }
      },
    });
    return editor;
  };

  const addEditor = () => {
    const newEditors = [...editors, {
      TitleEditor: createTitleEditor(),
      ContentEditor: createEditor(),
    }];
    const newData = [...DataArr, { Judul: "", Isi: "" }]
    setEditors(newEditors);
    setDataArr(newData)
  };

  const removeEditor = (index: number) => {
    const updatedEditors = editors.filter((editor, idx) => idx !== index);
    const updatedDataArr = DataArr.filter((data, idx) => idx !== index);
    setEditors(updatedEditors);
    setDataArr(updatedDataArr)
  };


  const handleToolbarClick = (command: any) => {
    const activeEditor = editors[activeEditorIndex]?.ContentEditor;
    if (activeEditor) {
      switch (command) {
        case 'toggleBold':
          activeEditor.chain().focus().toggleBold().run();
          break;

        case 'toggleItalic':
          activeEditor.chain().focus().toggleItalic().run();
          break;

        case 'toggleStrike':
          activeEditor.chain().focus().toggleStrike().run();
          break;

        case 'toggleUnderline':
          activeEditor.chain().focus().toggleUnderline().run();
          break;

        case 'toggleBlockquote':
          activeEditor.chain().focus().toggleBlockquote().run();
          break;

        case 'toggleOrderedList':
          activeEditor.chain().focus().toggleOrderedList().run();
          break;

        case 'toggleBulletList':
          activeEditor.chain().focus().toggleBulletList().run();
          break;

        case 'Sink':
          activeEditor.chain().focus().sinkListItem('listItem').run();
          break;

        default:
          break;
      }
    }
  };

  return (
    <div id="LaporanWrap" className="h-fit">
      <ToolBar onToolbarClick={handleToolbarClick} editor={editors[activeEditorIndex]?.ContentEditor} />
      <div className="editor-container">
        <div className="flex flex-col gap-6 px-7 py-6">
          <h1 className="text-2xl">Laporan </h1>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Ceritakan bagaimana berjalannya komitmenmu dalam 2 minggu terakhir.</h1>
            <div className="flex flex-col gap-2">
              {editors.map((editor, index) => {
                if (editor) {
                  return (
                    <div key={index} className="relative flex flex-col py-5">
                      <div className="flex px-4 gap-2">
                        <input
                          type="checkbox"
                          className="w-4"
                        />
                        <EditorContent editor={editor.TitleEditor} onFocus={() => {
                          setActiveEditorIndex(index)
                        }} />
                      </div>

                      <EditorContent
                        editor={editor.ContentEditor}
                        className="w-full px-1"
                        onFocus={() => {
                          setActiveEditorIndex(index);
                        }}
                      />
                      <div className="absolute right-[10px] top-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost"><Ellipsis /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => removeEditor(index)}>
                                Delete Komitmen
                                <DropdownMenuShortcut><Minus /></DropdownMenuShortcut>
                              </DropdownMenuItem>
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
              <div className="flex gap-4 self-end">
                <Button variant="ghost" className="w-fit gap-3" onClick={() => {
                  addEditor()
                }}>
                  <Plus />
                  <p className="underline">Tambah Komitmen</p>
                </Button>
                <Button onClick={() => {
                  // handleKomitmenDatatoAI(DataArr)
                  console.log(DataArr)
                }} className="w-fit gap-3 self-end">
                  <Sparkles />
                  <p>Cek Kualitas Deskripsi</p>
                </Button>
              </div>
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
    </div>
  );
}

export type { KomitmenData }
