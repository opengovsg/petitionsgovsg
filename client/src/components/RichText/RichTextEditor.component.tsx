import { EditorState, convertToRaw, ContentState } from 'draft-js'
import {
  FC,
  useEffect,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'

import './RichTextEditor.styles.scss'

import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { Editor, EditorProps } from 'react-draft-wysiwyg'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import styles from './RichTextEditor.module.scss'
import { RefCallBack } from 'react-hook-form'

const ExtendedEditor = (props: EditorProps) => <Editor {...props} />

const TOOLBAR_OPTIONS = {
  options: ['inline', 'list'],
  inline: {
    options: ['bold'],
  },
}

const createEditorStateFromHTML = (value: string) => {
  const contentBlock = htmlToDraft(value)
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks,
    )
    return EditorState.createWithContent(contentState)
  }
  return EditorState.createEmpty()
}

const defaultValue = {
  editorState: EditorState.createEmpty(),
  setEditorState: {} as Dispatch<SetStateAction<EditorState>>,
}
export const EditorContext = createContext(defaultValue)

export const RichTextEditor: FC<{
  onChange: (outputHTML: string) => void
  placeholder?: string
  readOnly?: boolean
  editorRef?: RefCallBack
  value: string
  wrapperStyle?: Record<string, string>
  editorStyle?: Record<string, string>
}> = ({
  onChange,
  placeholder,
  readOnly,
  value,
  editorRef,
  wrapperStyle = {},
  editorStyle = {},
}) => {
  // usage of context in the future for subcomponents?
  const [editorState, setEditorState] = useState(() => {
    if (value) return createEditorStateFromHTML(value)
    return EditorState.createEmpty()
  })

  useEffect(() => {
    // reset state upon submission
    if (!value) {
      setEditorState(createEditorStateFromHTML(value))
    }
    const currentContent = editorState.getCurrentContent()
    const html = draftToHtml(convertToRaw(currentContent))
    onChange(html)
  }, [editorState, onChange, value])

  return (
    <EditorContext.Provider value={{ editorState, setEditorState }}>
      <ExtendedEditor
        placeholder={placeholder}
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        toolbarClassName={styles.toolbar}
        wrapperStyle={wrapperStyle}
        editorStyle={editorStyle}
        toolbar={TOOLBAR_OPTIONS}
        readOnly={readOnly ? readOnly : false}
        stripPastedStyles
        editorRef={editorRef}
      />
    </EditorContext.Provider>
  )
}

export const RichTextPreview: FC<{
  placeholder?: string
  value: string
  editorClassName?: string
}> = ({ placeholder, value, editorClassName }) => {
  const [editorState, setEditorState] = useState(() => {
    if (value) return createEditorStateFromHTML(value)
    return EditorState.createEmpty()
  })

  useEffect(() => {
    const state = createEditorStateFromHTML(value)
    setEditorState(state)
  }, [value])

  return (
    <EditorContext.Provider value={{ editorState, setEditorState }}>
      <ExtendedEditor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        placeholder={placeholder}
        editorClassName={editorClassName}
        toolbar={toolbar}
        readOnly
        toolbarHidden
      />
    </EditorContext.Provider>
  )
}

export const RichTextFrontPreview: FC<{
  placeholder?: string
  value: string
}> = ({ placeholder, value }) => {
  return (
    <RichTextPreview
      placeholder={placeholder}
      value={value}
      editorClassName={styles.previewEditor}
    />
  )
}
