"use client"

export function DashboardContent() {
  return (
    <main className="flex-1 overflow-auto p-8">
      <div className="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center min-h-96">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Title</h1>
        <p className="text-gray-600 text-lg">Subtitle</p>
      </div>
    </main>
  )
}