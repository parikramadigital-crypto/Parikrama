import { useState } from "react";

const useCopyUrl = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (path) => {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return { copied, copy };
};

export default useCopyUrl;
