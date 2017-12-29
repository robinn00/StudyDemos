import wx
import os

class MyFrame(wx.Frame):

    def __init__(self):
        wx.Frame.__init__(self, None, -1, "My Frame", size=(300, 300))
        panel = wx.Panel(self, -1)
        panel.Bind(wx.EVT_MOTION,  self.OnMove)
        panel.Bind(wx.EVT_LEFT_DCLICK,self.OnClick)
        wx.StaticText(panel, -1, "Pos:", pos=(10, 12))
        self.posCtrl = wx.TextCtrl(panel, -1, "", pos=(40, 10))

    def OnMove(self, event):
        pos = event.GetPosition()
        self.posCtrl.SetValue("%s, %s" % (pos.x, pos.y))
    def OnClick(self,event):
        dlg = wx.TextEntryDialog(None, "Who is buried in Grant's tomb?",
                'A Question', 'Cary Grant')
        if dlg.ShowModal() == wx.ID_OK:
            response = dlg.GetValue()
            self.posCtrl.SetValue(response)
        dlg.Destroy()

if __name__ == '__main__':
    app = wx.App()
    frame = MyFrame()
    frame.Show(True)
    app.MainLoop()