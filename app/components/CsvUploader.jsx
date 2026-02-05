import { useState } from "react";
import { useFetcher } from "react-router";

// export default function CsvUploader() {
//   const [file, setFile] = useState(null);
//   const [target, setTarget] = useState("freee");

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("target", target);

//     await fetch("/api/csv", {
//       method: "POST",
//       body: formData,
//     });
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <select value={target} onChange={(e) => setTarget(e.target.value)}>
//         <option value="freee">freee</option>
//         <option value="moneyforward">マネーフォワード</option>
//       </select>

//       <input
//         type="file"
//         accept=".csv"
//         onChange={(e) => setFile(e.target.files[0])}
//       />

//       <button type="submit">変換</button>
//     </form>
//   );
// }

export default function CsvUploader() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/api/csv" encType="multipart/form-data">
      <select name="target">
        <option value="freee">freee</option>
        <option value="moneyforward">マネーフォワード</option>
      </select>

      <input type="file" name="file" accept=".csv" />

      <button type="submit">変換</button>

      {fetcher.data && (
        <pre>{JSON.stringify(fetcher.data.result, null, 2)}</pre>
      )}
    </fetcher.Form>
  );
}