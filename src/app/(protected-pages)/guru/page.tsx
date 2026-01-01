import React from "react";

const GuruPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Manajemen Guru</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Kelola data guru di sekolah Anda
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Halaman Manajemen Guru</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Fitur manajemen guru akan tersedia segera. Di sini Anda dapat
            menambah, mengedit, dan menghapus data guru.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuruPage;
