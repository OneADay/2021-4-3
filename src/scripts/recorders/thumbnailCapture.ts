

let saveThumbnail = (canvas: HTMLCanvasElement) => {
    let url = canvas.toDataURL('image/jpg');

    const link = document.createElement('a');
    link.href = url;
    const date = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
    link.download = `OneADay_${date}_thumbnail.jpg`;

    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );
}

export default saveThumbnail;