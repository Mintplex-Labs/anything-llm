import _thread, time
from scripts.watch.main import watch_for_changes

a_list = []
WATCH_DIRECTORY = "hotdir"
def input_thread(a_list):
    input()
    a_list.append(True)

def main():
  _thread.start_new_thread(input_thread, (a_list,))
  print(f"Watching '{WATCH_DIRECTORY}/' for new files.\n\nUpload files into this directory while this script is running to convert them.\nPress enter or crtl+c to exit script.")
  while not a_list:
    watch_for_changes(WATCH_DIRECTORY)
    time.sleep(1)
  
  print("Stopping watching of hot directory.")
  exit(1)

if __name__ == "__main__":
  main()