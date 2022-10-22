import glob, time, os, sys
import win32com.client
import stat, json
import requests
import hashlib

TIME_LIMIT = 60 * 60 * 24
SHELL = win32com.client.Dispatch("WScript.Shell")

def fetch_latest_files(basedir, dirls):

	filelib_name = []
	filelib_md5  = []
	filelib = {}

	for i in dirls:

		target_path = os.path.join(basedir, i)

		if not os.path.exists(target_path):
			continue

		allfiles = glob.glob(target_path + "/*")

		for j in allfiles:

			try:
				file_name = SHELL.CreateShortCut(j).Targetpath
				if (stat.S_ISDIR(os.stat(file_name).st_mode)):
					continue

				with open(file_name, 'rb') as fp:
					data = fp.read()
				file_md5 = hashlib.md5(data).hexdigest()
				print(file_md5, file_name)

				filelib_name.append(file_name)
				filelib_md5.append(file_md5)
				filelib[file_md5] = file_name
			except Exception as err:
				pass

	return filelib_name, filelib_md5, filelib

if __name__ == "__main__":
	_file, _md5, _files = fetch_latest_files(os.environ["APPDATA"], [
		"Microsoft/Windows/Recent",
		"Microsoft/Office/Recent"
	]);

	print(_files)

	port = "65432"
	requests.post("http://localhost:" + port + "/Ucopyer/copy", data = {"data": json.dumps(_files)});