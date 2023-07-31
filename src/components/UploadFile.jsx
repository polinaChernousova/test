import axios from "axios";
import { useEffect, useState } from "react";

const YANDEX_DISK_TOKEN =
  "y0_AgAAAABvqGo7AADLWwAAAADoyAplhF1-L8G1SGmME_2QpEAT-ztIuaU";

export default function UploadFile() {
  const [files, setFiles] = useState([]);

  // config
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `OAuth ${YANDEX_DISK_TOKEN}`,
    },
  };

  async function handleGet() {
    const { data } = await axios.get(
      `https://cloud-api.yandex.net/v1/disk/resources/files?path=disk&overwrite=true`,
      options
    );
    setFiles(data.items);
  }

  useEffect(() => {
    handleGet();
  }, []);

  // link handler
  const handleFile = (e) => {
    const res = e.target.files;
    setFiles(res);
  };

  async function updateFile() {
    const [name] = files;
    // file link
    const uploadUrl = `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${name.name}&overwrite=true`;

    const { data } = await axios.get(uploadUrl, options);
    const formData = new FormData();

    for (let i in files) {
      formData.append("file", files[i]);
    }

    const res = await axios.put(`${data.href}`, formData);
    console.log(res);
  }

  return (
    <div style={{margin:" 0 auto", maxWidth:"1200px"}}>
      <div
        style={{
          display: " flex",
          justifyContent: "center",
          marginTop:"30px"
        }}
      >
        <input onChange={handleFile} type="file" multiple />
        <button onClick={() => updateFile()}>Перетащите файлы сюда </button>
      </div>

      <div>
        {files.map((item, index) => (
          <img
            key={index}
            src={item.sizes[0].url}
            width={300}
            height={300}
            alt="images from disk"
          />
        ))}
      </div>
  </div>
  );
}
