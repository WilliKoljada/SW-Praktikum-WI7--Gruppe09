from src.server.bo import BusinessObject as bo


# User Klasse
class Projektarbeit (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._projektarbeit_id = 0
        self._bezeichnung = ""


    def get_projektarbeit_id(self):
        return self._projektarbeit_id

    def set_projektarbeit_id(self, value):
        self._projektarbeit_id = value

    def get_bezeichnung(self):
        return self._bezeichnung

    def set_bezeichnung(self, value):
        self._bezeichnung = value