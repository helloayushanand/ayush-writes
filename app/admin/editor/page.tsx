import { redirect } from 'next/navigation';
import { isAuthenticated } from '../actions';
import Editor from './editor';

export default async function EditorPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin');
  }
  return <Editor />;
}
