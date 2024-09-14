import { getState, setProgress, setState } from './progress';

/**
 * 下载瓦片
 * @param {Array} list 瓦片列表
 * @param {Function} apiDownload 下载方法
 * @returns
 */
export function downloadLoop(list: any[], apiDownload: (arg: any) => void) {
  if (!Array.isArray(list) || typeof apiDownload !== 'function') return;
  const length = list.length;
  if (length === 0) return;

  const statistics = { success: 0, error: 0, percentage: 0, count: length };
  let index = 0;
  const download = () => {
    // console.log('download', index, length);
    if (index >= length) {
      statistics.percentage = 100;
      setProgress(statistics);
      setState(false);
      window.$message.success(
        `下载完成。下载成功${statistics.success}，下载失败${statistics.error}`,
      );
      return;
    }
    const item = list[index];
    statistics.percentage = Number(((index / length) * 100).toFixed(2));
    apiDownload(item);
    index++;
  };
  download();
  window.electron.imageDownloadDone((state: any) => {
    if (!getState()) return;
    if (state.state === 'completed') {
      statistics.success++;
    } else {
      statistics.error++;
    }
    setProgress(statistics);
    download();
  });
}
