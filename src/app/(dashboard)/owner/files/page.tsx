"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Folder,
  Loader2,
  RefreshCw,
  Save,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FileNode {
  name: string;
  type: "file" | "directory";
  path: string;
  size?: number;
  modified?: string;
  children?: FileNode[];
}

export default function OwnerFilesPage() {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");
  const [searchPath, setSearchPath] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch file tree
  const { data: fileTree, isLoading: treeLoading } = useQuery({
    queryKey: ["fileTree"],
    queryFn: async () => {
      const res = await api.get("/owner/files/tree");
      return res.data as FileNode[];
    },
  });

  // Read file content
  const readFileMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const res = await api.post("/owner/files/read", { path: filePath });
      return res.data;
    },
    onSuccess: (data) => {
      setFileContent(data.content || "");
      setSelectedFile(data.path);
      toast.success("File loaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to read file");
    },
  });

  // Save file
  const saveFileMutation = useMutation({
    mutationFn: async (data: { path: string; content: string }) => {
      const res = await api.post("/owner/files/save", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("File saved successfully");
      queryClient.invalidateQueries({ queryKey: ["fileTree"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to save file");
    },
  });

  // Validate and fix code
  const validateMutation = useMutation({
    mutationFn: async (data: { path: string; content: string }) => {
      const res = await api.post("/owner/files/validate-fix", data);
      return res.data;
    },
    onSuccess: (data) => {
      setFileContent(data.content || fileContent);
      toast.success("Code validated and formatted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Validation failed");
    },
  });

  const handleFileSelect = (filePath: string) => {
    readFileMutation.mutate(filePath);
  };

  const handleSaveFile = () => {
    if (!selectedFile || !fileContent) {
      toast.error("Please select a file and enter content");
      return;
    }
    saveFileMutation.mutate({ path: selectedFile, content: fileContent });
  };

  const handleValidateCode = () => {
    if (!selectedFile || !fileContent) {
      toast.error("Please select a file first");
      return;
    }
    validateMutation.mutate({ path: selectedFile, content: fileContent });
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-zinc-800 ${
            selectedFile === node.path ? "bg-zinc-700" : ""
          }`}
          onClick={() => node.type === "file" && handleFileSelect(node.path)}
        >
          {node.type === "directory" ? (
            <Folder className="w-4 h-4 text-blue-400" />
          ) : (
            <FileText className="w-4 h-4 text-zinc-400" />
          )}
          <span className="text-sm">{node.name}</span>
          {node.size && (
            <span className="text-xs text-zinc-500 ml-auto">
              {(node.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
        {node.children && renderFileTree(node.children, level + 1)}
      </div>
    ));
  };

  const filteredFiles =
    fileTree?.filter((node) => {
      if (!searchPath) return true;
      return node.path.toLowerCase().includes(searchPath.toLowerCase());
    }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Manager</h1>
          <p className="text-zinc-400">Manage project files and code</p>
        </div>
        <Button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["fileTree"] })
          }
          variant="outline"
          className="border-zinc-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Tree */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5" />
              Project Files
            </CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search files..."
                value={searchPath}
                onChange={(e) => setSearchPath(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </CardHeader>
          <CardContent>
            {treeLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading file tree...
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-1">
                {renderFileTree(filteredFiles)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Editor */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                File Editor
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleValidateCode}
                  disabled={validateMutation.isPending || !selectedFile}
                  variant="outline"
                  className="border-zinc-600"
                >
                  {validateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveFile}
                  disabled={saveFileMutation.isPending || !selectedFile}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saveFileMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardTitle>
            {selectedFile && (
              <p className="text-sm text-zinc-400 font-mono">{selectedFile}</p>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Select a file to edit..."
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="bg-zinc-800 border-zinc-700 font-mono text-sm min-h-96"
              disabled={!selectedFile}
            />
          </CardContent>
        </Card>
      </div>

      {/* Code Validation Info */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Code Validation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">Syntax Check</h4>
              <p className="text-zinc-400">
                Automatic syntax validation before saving to prevent server
                crashes.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Auto Format</h4>
              <p className="text-zinc-400">
                Code formatting with Black (Python) or Prettier for clean,
                consistent code.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-400">AI Fix</h4>
              <p className="text-zinc-400">
                AI-powered code fixing for syntax errors and improvements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
