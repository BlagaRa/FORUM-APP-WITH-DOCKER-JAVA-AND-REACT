package forum.forum.service.pgDialect;

import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.dialect.PostgreSQLDialect;
import org.hibernate.query.sqm.function.SqmFunctionDescriptor;
import org.hibernate.sql.ast.SqlAstTranslator;
import org.hibernate.sql.ast.spi.SqlAppender;
import org.hibernate.sql.ast.tree.SqlAstNode;
import org.hibernate.type.StandardBasicTypes;


public class FtsPgDialect extends PostgreSQLDialect {
    public FtsPgDialect(){
        super();
    }
    @Override
    public void contributeFunctions(FunctionContributions contributions) {
        contributions.getFunctionRegistry().registerPattern(
                "fts",
                "(to_tsvector('simple', ?1) @@ websearch_to_tsquery('simple', ?2))"
//                ,
//                contributions.getTypeConfiguration()
//                        .getBasicTypeRegistry()
//                        .resolve(StandardBasicTypes.FLOAT)
        );
    }
}
