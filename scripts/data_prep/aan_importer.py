class aan_importer:

  '''
  Takes:
    aan_release_path  the path to a specific year of aan release with trailing slash (e.g aan/release/2013/)
  '''
  def __init__(self, aan_release_path):
    self.aan_release_path = aan_release_path


  '''
  Returns mapping from
  {<paper_id> : {'title' : <paper_title>, 'year' : <year published>}, ...}
  '''
  def paper_ids_to_identifiers(self):
    paper_map_path = self.aan_release_path + "paper_ids.txt"
    # paper_ids = []
    mappings = {}
    with open(paper_map_path, 'r') as paper_map:
      for line in paper_map:
        split_line = line.rstrip().split("\t")
        if len(split_line) != 3:
          print split_line

        mappings[split_line[0]] = {'title' : split_line[1], 'year' : split_line[2]}
    return mappings

  '''
  Returns mapping from aan author ids to their names
  {<author_id> : <author_name>, ...}
  '''
  def author_id_to_names(self):
    file_path = self.aan_release_path + "author_ids.txt"
    mappings = {}
    with open(file_path, 'r') as author_map:
      for line in author_map:
        author_id, _sep, author_name = line.rstrip().partition("\t")
        mappings[author_id] = author_name
    return mappings

  '''
  Returns mapping from paper_id => [<author_id>, ...]
  '''
  def papers_to_authors(self):
    file_path = self.aan_release_path + "paper_author_affiliations.txt"
    mappings ={}
    with open(file_path, 'r') as paper_author_map:
      for line in paper_author_map:
        split_line = line.rstrip().split("\t")
        if len(split_line) != 3:
          print split_line

        paper_id = split_line[0]
        if paper_id not in mappings:
          mappings[paper_id] = []
        
        mappings[paper_id].append(split_line[1])

    return mappings