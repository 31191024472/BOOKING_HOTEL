import axios from 'axios';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EmailPromotion = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('message', message);
    if (attachment) {
      formData.append('file', attachment);
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/email/send',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setStatus(response.data.message);
    } catch (error) {
      console.error(error);
      setStatus('Lỗi khi gửi email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Gửi Email Khuyến Mãi</h2>

      {status && <p className="mb-4 text-green-600">{status}</p>}

      <form onSubmit={handleSendEmail} className="space-y-4">
        <div>
          <label className="block font-medium">Tiêu đề</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Nội dung</label>
          <ReactQuill
            theme="snow"
            value={message}
            onChange={setMessage}
            className="bg-white"
          />
        </div>

        <div>
          <label className="block font-medium">Đính kèm (ảnh/tệp)</label>
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi Email'}
        </button>
      </form>
    </div>
  );
};

export default EmailPromotion;
